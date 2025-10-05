// File: backend/routes/facultyRoutes.js

const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/authMiddleware");
const {
  getRecentAttendance,
  getSubjectWiseSummary,
  getMyClasses,
} = require("../controllers/facultyController");

// All routes in this file are protected and for FACULTY role
router.use(protect, authorize("FACULTY", "HOD", "PRINCIPAL"));

// @route   GET /api/faculty/attendance/recent
// @desc    Get the last 5 attendance records for the faculty
router.get("/attendance/recent", getRecentAttendance);

// @route   GET /api/faculty/attendance/summary
// @desc    Get the overall attendance percentage for each subject
router.get("/attendance/summary", getSubjectWiseSummary);

router.get("/my-classes", getMyClasses);

module.exports = router;
