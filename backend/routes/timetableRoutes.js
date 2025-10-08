const express = require("express");
const router = express.Router();
const {
  getTimetableByClass,
  upsertTimetableEntry,
} = require("../controllers/timetableController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.use(protect, authorize("ADMIN"));

router.route("/class/:classId").get(getTimetableByClass);
router.route("/entry").post(upsertTimetableEntry);

module.exports = router;
