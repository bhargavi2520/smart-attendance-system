// File: backend/controllers/facultyController.js

const db = require("../models"); // Ensure the database models are imported
const { Sequelize } = require("../models");

// @desc    Get recent attendance actions for the faculty dashboard
// @route   GET /api/faculty/attendance/recent
// @access  Private (Faculty)
exports.getRecentAttendance = async (req, res) => {
  try {
    // This query now safely fetches real data.
    // `findAll` will return an empty array `[]` if no records are found.
    const recentActions = await db.Attendance.findAll({
      where: { marked_by: req.user.id },
      limit: 5,
      order: [["createdAt", "DESC"]],
      // You may need to add 'include' here to get course/class names
      // include: [{ model: db.Timetable, include: [db.Course] }]
    });
    res.json(recentActions);
  } catch (error) {
    console.error("Error fetching recent attendance:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Get subject-wise attendance summary for the faculty dashboard
// backend/controllers/facultyController.js

exports.getSubjectWiseSummary = async (req, res) => {
  try {
    const summary = await db.Timetable.findAll({
      where: { facultyId: req.user.id }, // Make sure this is facultyId
      attributes: [
        // Select the course name and code
        [Sequelize.col("course.name"), "courseName"],
        [Sequelize.col("course.code"), "courseCode"],
        // Count the number of associated attendance records for each course
        [
          Sequelize.fn("COUNT", Sequelize.col("Attendances.id")),
          "attendanceCount",
        ],
      ],
      include: [
        {
          model: db.Course,
          as: "course",
          attributes: [], // Exclude attributes from the top-level select
        },
        {
          model: db.Attendance,
          as: "Attendances", // Use the alias from your Timetable model
          attributes: [], // Exclude attributes from the top-level select
        },
      ],
      group: ["course.id", "course.name", "course.code"], // Group by course details
      raw: true,
    });

    res.json(summary);
  } catch (error) {
    console.error("Error fetching attendance summary:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// backend/controllers/facultyController.js

// @desc    Get all classes assigned to the logged-in faculty
// @route   GET /api/faculty/my-classes
// @access  Private (Faculty)
exports.getMyClasses = async (req, res) => {
  try {
    const myClasses = await db.Timetable.findAll({
      where: { facultyId: req.user.id },
      attributes: [
        "id",
        "dayOfWeek",
        "startTime",
        "courseId",
        "classId",
        "facultyId",
      ],
      include: [
        { model: db.Course, as: "course", attributes: ["name"] },
        { model: db.Class, as: "class", attributes: ["name"] },
      ],
      order: [
        ["dayOfWeek", "ASC"],
        ["startTime", "ASC"],
      ],
    });
    res.json(myClasses);
  } catch (error) {
    console.error("Error fetching faculty classes:", error);
    res.status(500).json({ message: "Server error" });
  }
};
