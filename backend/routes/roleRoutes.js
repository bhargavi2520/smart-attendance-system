// backend/routes/roleRoutes.js
const express = require("express");
const router = express.Router();
const { getAllRoles } = require("../controllers/roleController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.get("/", protect, authorize("ADMIN"), getAllRoles);

module.exports = router;
