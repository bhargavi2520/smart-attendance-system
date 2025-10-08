// backend/controllers/courseController.js

const db = require("../models");

// @desc    Get all courses
// @route   GET /api/courses
// @access  Private/Admin
exports.getAllCourses = async (req, res) => {
  try {
    const courses = await db.Course.findAll({
      order: [["name", "ASC"]],
    });
    res.json(courses);
  } catch (error) {
    console.error("Failed to get courses:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
