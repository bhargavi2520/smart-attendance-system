// routes/dashboardRoutes.js
const express = require("express");
const router = express.Router();
const { getStats } = require("../controllers/dashboardController");
const { protect, authorize } = require("../middleware/authMiddleware");

// This creates the GET /api/dashboard/stats endpoint
// It's protected and authorized for ADMIN users only.
router.get("/stats", protect, authorize("ADMIN"), getStats);

module.exports = router;
