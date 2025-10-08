// backend/routes/courseRoutes.js

const express = require("express");
const router = express.Router();
const { getAllCourses } = require("../controllers/courseController");
const { protect, authorize } = require("../middleware/authMiddleware");

// This route is used by admins to build the timetable, so it should be protected.
router.route("/").get(protect, authorize("ADMIN"), getAllCourses);

module.exports = router;
