// routes/departmentRoutes.js
const express = require("express");
const router = express.Router();
const { getAllDepartments } = require("../controllers/departmentController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.get("/", protect, authorize("admin"), getAllDepartments);

module.exports = router;
