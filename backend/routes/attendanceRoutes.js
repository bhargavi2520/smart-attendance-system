// routes/attendanceRoutes.js
const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/authMiddleware");
const {
  getFacultyTodayClasses,
  getStudentsForSession,
  markAttendance,
  // getStudentAttendance, // Temporarily commented out
  // getStudentDetailedAttendance, // Temporarily commented out
} = require("../controllers/attendanceController");

// --- Faculty Routes ---
router.get(
  "/faculty/today",
  protect,
  authorize("FACULTY", "HOD", "INCHARGE", "PRINCIPAL", "ADMIN"),
  getFacultyTodayClasses
);
router.get(
  "/session/:timetableId/students",
  protect,
  authorize("FACULTY", "HOD", "INCHARGE", "PRINCIPAL", "ADMIN"),
  getStudentsForSession
);
router.post(
  "/mark",
  protect,
  authorize("FACULTY", "HOD", "INCHARGE"),
  markAttendance
);

// --- Student Routes (Currently Disabled) ---
// router.get("/student/summary", protect, authorize("STUDENT"), getStudentAttendance);
// router.get("/student/details/:courseId", protect, authorize("STUDENT"), getStudentDetailedAttendance);

module.exports = router;
