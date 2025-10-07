const express = require("express");
const router = express.Router();
const { getTimetableByClass } = require("../controllers/timetableController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.use(protect, authorize("ADMIN"));

router.route("/class/:classId").get(getTimetableByClass);

module.exports = router;
