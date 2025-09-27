const db = require("../models");
const { Op } = require("sequelize");
const User = db.User;
const Course = db.Course;
const Attendance = db.Attendance;
const Timetable = db.Timetable;
const StudentCourse = db.StudentCourse;

// FACULTY: Get faculty's classes for the current day
exports.getFacultyTodayClasses = async (req, res) => {
  try {
    const facultyId = req.user.id;
    const today = new Date().toLocaleString("en-US", { weekday: "long" }); // e.g., "Monday"

    const classes = await Timetable.findAll({
      where: {
        facultyId: facultyId,
        dayOfWeek: today,
      },
      include: [
        {
          model: Course,
          attributes: ["courseName", "courseCode"],
        },
      ],
      order: [["startTime", "ASC"]],
    });
    res.json(classes);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// FACULTY: Get student list for a specific class session to mark attendance
exports.getStudentsForSession = async (req, res) => {
  try {
    const { timetableId } = req.params;
    const timetableEntry = await Timetable.findByPk(timetableId);
    if (!timetableEntry) {
      return res.status(404).json({ message: "Class session not found." });
    }

    const enrolledStudents = await StudentCourse.findAll({
      where: { courseId: timetableEntry.courseId },
      include: [
        {
          model: User,
          as: "student",
          attributes: ["id", "name", "email"],
        },
      ],
    });

    const students = enrolledStudents.map((sc) => sc.student);

    res.json({
      timetable: timetableEntry,
      students: students,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// FACULTY: Mark attendance for a session
exports.markAttendance = async (req, res) => {
  const { timetableId, date, attendanceData } = req.body; // attendanceData is an array of { studentId, status }
  const t = await db.sequelize.transaction();
  try {
    // Check if attendance for this session on this date has already been marked
    const existingAttendance = await Attendance.findOne({
      where: {
        timetableId,
        date,
      },
    });

    if (existingAttendance) {
      return res
        .status(409)
        .json({
          message:
            "Attendance for this session has already been marked for this date.",
        });
    }

    const records = attendanceData.map((record) => ({
      ...record,
      timetableId,
      date,
      markedBy: req.user.id,
    }));

    await Attendance.bulkCreate(records, { transaction: t });
    await t.commit();
    res.status(201).json({ message: "Attendance marked successfully." });
  } catch (error) {
    await t.rollback();
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// STUDENT: Get a student's own attendance records
exports.getStudentAttendance = async (req, res) => {
  try {
    const studentId = req.user.id;
    const studentCourses = await StudentCourse.findAll({
      where: { studentId },
    });
    const courseIds = studentCourses.map((sc) => sc.courseId);

    const attendanceSummary = await Course.findAll({
      where: { id: courseIds },
      attributes: ["id", "courseName", "courseCode"],
      include: [
        {
          model: Timetable,
          attributes: [],
          required: true,
          include: [
            {
              model: Attendance,
              where: { studentId },
              attributes: [],
              required: true, // Use inner join to only get courses with attendance marked
            },
          ],
        },
      ],
      group: ["Course.id"],
      // Use subqueries or raw queries if this gets too complex for ORM
      attributes: [
        "id",
        "courseName",
        "courseCode",
        [
          db.sequelize.fn(
            "COUNT",
            db.sequelize.col("Timetables.Attendances.id")
          ),
          "totalClasses",
        ],
        [
          db.sequelize.fn(
            "SUM",
            db.sequelize.literal(
              `CASE WHEN "Timetables->Attendances"."status" = 'PRESENT' THEN 1 ELSE 0 END`
            )
          ),
          "attendedClasses",
        ],
      ],
    });

    const formattedSummary = attendanceSummary.map((course) => {
      const total = parseInt(course.get("totalClasses"));
      const attended = parseInt(course.get("attendedClasses"));
      return {
        courseName: course.courseName,
        courseCode: course.courseCode,
        totalClasses: total,
        attendedClasses: attended,
        percentage: total > 0 ? (attended / total) * 100 : 0,
      };
    });

    res.json(formattedSummary);
  } catch (error) {
    console.error("Error fetching student attendance:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get detailed attendance for a student in a specific course
exports.getStudentDetailedAttendance = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { courseId } = req.params;

    const records = await Attendance.findAll({
      where: {
        studentId,
      },
      include: {
        model: Timetable,
        where: { courseId },
        attributes: ["dayOfWeek", "startTime"],
        include: {
          model: Course,
          attributes: ["courseName"],
        },
      },
      order: [["date", "DESC"]],
    });
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
