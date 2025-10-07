// controllers/dashboardController.js
const db = require("../models");

exports.getStats = async (req, res) => {
  try {
    const userCount = await db.User.count();
    const classCount = await db.Class.count();
    const departmentCount = await db.Department.count();
    const timetableCount = await db.Timetable.count();

    res.json({
      totalUsers: userCount,
      totalClasses: classCount,
      totalDepartments: departmentCount,
      totalTimetables: timetableCount,
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
