const db = require("../models");
const { Op, Sequelize } = require("sequelize");
const User = db.User;
const Course = db.Course;
const Attendance = db.Attendance;
const Timetable = db.Timetable;
const StudentCourse = db.StudentCourse;

// HOD: Get department-wide attendance stats
exports.getDepartmentStats = async (req, res) => {
  try {
    const hod = await User.findByPk(req.user.id);
    const department = hod.department; // Assuming HOD model has a department field

    // Find all courses in the department
    const courses = await Course.findAll({ where: { department } });
    const courseIds = courses.map((c) => c.id);

    // Find all timetabled sessions for these courses
    const timetables = await Timetable.findAll({
      where: { courseId: courseIds },
    });
    const timetableIds = timetables.map((t) => t.id);

    const totalClasses = await Attendance.count({
      where: { timetableId: timetableIds },
    });
    const presentCount = await Attendance.count({
      where: { timetableId: timetableIds, status: "PRESENT" },
    });

    const overallPercentage =
      totalClasses > 0 ? (presentCount / totalClasses) * 100 : 0;

    // Per-class analytics
    const classAnalytics = await Course.findAll({
      where: { department },
      attributes: ["id", "courseName"],
      include: [
        {
          model: Timetable,
          attributes: [],
          required: true,
          include: [
            {
              model: Attendance,
              attributes: [],
              required: true,
            },
          ],
        },
      ],
      group: ["Course.id"],
      attributes: [
        "id",
        "courseName",
        [
          Sequelize.fn("COUNT", Sequelize.col("Timetables.Attendances.id")),
          "total",
        ],
        [
          Sequelize.fn(
            "SUM",
            Sequelize.literal(
              `CASE WHEN "Timetables->Attendances"."status" = 'PRESENT' THEN 1 ELSE 0 END`
            )
          ),
          "present",
        ],
      ],
    });

    const formattedClassAnalytics = classAnalytics.map((c) => {
      const total = parseInt(c.get("total"));
      const present = parseInt(c.get("present"));
      return {
        courseName: c.courseName,
        percentage: total > 0 ? (present / total) * 100 : 0,
      };
    });

    res.json({
      department,
      overallPercentage,
      totalClasses,
      presentCount,
      classAnalytics: formattedClassAnalytics,
    });
  } catch (error) {
    console.error("Error fetching department stats:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Principal: Get institution-wide stats
exports.getInstitutionStats = async (req, res) => {
  try {
    const departments = await Course.findAll({
      attributes: [
        [Sequelize.fn("DISTINCT", Sequelize.col("department")), "department"],
      ],
    });

    const departmentStats = [];

    for (const dept of departments) {
      const department = dept.department;
      const courses = await Course.findAll({ where: { department } });
      const courseIds = courses.map((c) => c.id);
      const timetables = await Timetable.findAll({
        where: { courseId: courseIds },
      });
      const timetableIds = timetables.map((t) => t.id);

      const totalClasses = await Attendance.count({
        where: { timetableId: timetableIds },
      });
      const presentCount = await Attendance.count({
        where: { timetableId: timetableIds, status: "PRESENT" },
      });
      const percentage =
        totalClasses > 0 ? (presentCount / totalClasses) * 100 : 0;

      departmentStats.push({
        department,
        percentage,
      });
    }

    const totalClasses = await Attendance.count();
    const presentCount = await Attendance.count({
      where: { status: "PRESENT" },
    });
    const overallPercentage =
      totalClasses > 0 ? (presentCount / totalClasses) * 100 : 0;

    res.json({
      overallPercentage,
      departmentStats,
    });
  } catch (error) {
    console.error("Error fetching institution stats:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
