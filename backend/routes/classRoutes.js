// routes/classRoutes.js
const express = require("express");
const router = express.Router();
const {
  getAllClasses,
  createClass,
  getClassById,
  updateClass,
  deleteClass,
} = require("../controllers/classController");
const { protect, authorize } = require("../middleware/authMiddleware");

router
  .route("/")
  .get(protect, authorize("ADMIN"), getAllClasses)
  .post(protect, authorize("ADMIN"), createClass);

router
  .route("/:id")
  .get(protect, authorize("ADMIN"), getClassById)
  .put(protect, authorize("ADMIN"), updateClass)
  .delete(protect, authorize("ADMIN"), deleteClass);

module.exports = router;
