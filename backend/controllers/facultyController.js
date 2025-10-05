// File: backend/controllers/facultyController.js

const db = require("../models"); // Ensure the database models are imported

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
// @route   GET /api/faculty/attendance/summary
// @access  Private (Faculty)
exports.getSubjectWiseSummary = async (req, res) => {
  try {
    // This is an example of a safe query for a summary.
    // The key is that the final result is always an array.
    // Your actual aggregation logic might be more complex.
    const summary = await db.Timetable.findAll({
      where: { faculty_id: req.user.id },
      // This is a simplified example. You would typically perform an
      // aggregation here to calculate the average percentage for each subject.
      // However, `findAll` itself is safe and will return `[]` if no courses are assigned.
      include: [{ model: db.Course, as: "course" }],
      group: ["course.id"], // Example of grouping by course
    });
    res.json(summary);
  } catch (error) {
    console.error("Error fetching attendance summary:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
