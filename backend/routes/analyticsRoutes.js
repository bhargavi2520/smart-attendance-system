const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/authMiddleware");
const {
  getDepartmentStats,
  getInstitutionStats,
  getAdminDashboardStats, // <-- ADDED IMPORT
} = require("../controllers/analyticsController");

// HOD route
router.get(
  "/department",
  protect,
  authorize("HOD", "INCHARGE"),
  getDepartmentStats
);

// Principal route
router.get(
  "/institution",
  protect,
  authorize("PRINCIPAL"),
  getInstitutionStats
);

// Admin Dashboard Route
// Allows ADMIN and PRINCIPAL to view the main stats
router.get(
  "/admin/stats",
  protect,
  authorize("ADMIN", "PRINCIPAL"),
  getAdminDashboardStats
);

module.exports = router;
