const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");
const {
  getFacultyTodayClasses,
  getStudentsForSession,
  markAttendance,
  getStudentAttendance,
  getStudentDetailedAttendance,
} = require("../controllers/attendanceController");

// Faculty Routes
router.get(
  "/faculty/today",
  protect,
  authorize("FACULTY"),
  getFacultyTodayClasses
);
router.get(
  "/session/:timetableId/students",
  protect,
  authorize("FACULTY"),
  getStudentsForSession
);
router.post("/mark", protect, authorize("FACULTY"), markAttendance);

// Student Routes
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
