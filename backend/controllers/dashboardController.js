// controllers/dashboardController.js
const db = require("../models");

exports.getStats = async (req, res) => {
  try {
    // Count the number of student profiles to get the total students
    const totalStudents = await db.StudentProfile.count();

    // Count the number of faculty profiles to get the total faculty
    const totalFaculty = await db.FacultyProfile.count();

    // Count the number of classes
    const totalClasses = await db.Class.count();

    // Send the correctly named stats to the frontend
    res.json({
      totalClasses,
      totalStudents,
      totalFaculty,
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
