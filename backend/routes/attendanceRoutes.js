// routes/attendanceRoutes.js
const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/authMiddleware");

// FIX: Import all functions, including placeholders, to prevent crash
const {
  getFacultyTodayClasses,
  getStudentsForSession,
  markAttendance,
  getStudentAttendance,
  getStudentDetailedAttendance,
} = require("../controllers/attendanceController");

const facultyAndAdminRoles = [
  "FACULTY",
  "HOD",
  "INCHARGE",
  "PRINCIPAL",
  "ADMIN",
];

router.get(
  "/faculty/today",
  protect,
  authorize(...facultyAndAdminRoles),
  getFacultyTodayClasses
);
router.get(
  "/session/:timetableId/students",
  protect,
  authorize(...facultyAndAdminRoles),
  getStudentsForSession
);
router.post(
  "/mark",
  protect,
  authorize("FACULTY", "INCHARGE", "HOD"),
  markAttendance
);

// --- Student Routes (Currently point to placeholder functions) ---
router.get(
  "/student/summary",
  protect,
  authorize("STUDENT"),
  getStudentAttendance
);
router.get(
  "/student/details/:courseId",
  protect,
  authorize("STUDENT"),
  getStudentDetailedAttendance
);

module.exports = router;
