// routes/classRoutes.js
const express = require("express");
const router = express.Router();
const {
  getAllClasses,
  createClass,
  deleteClass,
} = require("../controllers/classController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.use(protect, authorize("ADMIN"));

router.route("/").get(getAllClasses).post(createClass);
router.route("/:id").delete(deleteClass);

module.exports = router;
