// controllers/attendanceController.js
const db = require("../models");

exports.getFacultyTodayClasses = async (req, res) => {
  try {
    const facultyId = req.user.id;
    // Get the current day in the full string format (e.g., "Saturday")
    const today = new Date().toLocaleString("en-US", { weekday: "long" });

    const classes = await db.Timetable.findAll({
      where: {
        faculty_id: facultyId,
        day_of_week: today,
      },
      include: [
        {
          model: db.Course,
          // --- FIX: ---
          // 1. Select the correct columns 'name' and 'code'.
          // 2. Alias them as 'courseName' and 'courseCode' so the frontend receives the expected format.
          attributes: [
            ["name", "courseName"],
            ["code", "courseCode"],
          ],
        },
        {
          model: db.Class,
          attributes: ["name", "department"],
        },
      ],
      order: [["start_time", "ASC"]],
    });
    res.json(classes);
  } catch (error) {
    console.error("!!! ERROR in getFacultyTodayClasses:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ... (rest of the controller file remains the same)

exports.getStudentsForSession = async (req, res) => {
  try {
    const { timetableId } = req.params;
    const timetableEntry = await db.Timetable.findByPk(timetableId, {
      include: [db.Course, db.Class],
    });

    if (!timetableEntry) {
      return res.status(404).json({ message: "Class session not found." });
    }

    // Find the student profiles linked to this specific class
    const studentProfiles = await db.StudentProfile.findAll({
      where: { class_id: timetableEntry.class_id },
      include: [
        {
          model: db.User,
          as: "user",
          attributes: ["id", "name", "email"],
        },
      ],
    });

    const students = studentProfiles.map((p) => p.user);

    res.json({
      timetable: timetableEntry,
      students: students,
    });
  } catch (error) {
    console.error("!!! ERROR in getStudentsForSession:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.markAttendance = async (req, res) => {
  const { timetableId, date, attendanceData } = req.body;
  const t = await db.sequelize.transaction();
  try {
    const existingAttendance = await db.Attendance.findOne({
      where: {
        timetable_id: timetableId,
        date,
      },
    });

    if (existingAttendance) {
      return res.status(409).json({
        message:
          "Attendance for this session has already been marked for this date.",
      });
    }

    const records = attendanceData.map((record) => ({
      student_id: record.studentId,
      status: record.status,
      timetable_id: timetableId,
      date,
      marked_by: req.user.id,
    }));

    await db.Attendance.bulkCreate(records, { transaction: t });
    await t.commit();
    res.status(201).json({ message: "Attendance marked successfully." });
  } catch (error) {
    await t.rollback();
    console.error("!!! ERROR in markAttendance:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
