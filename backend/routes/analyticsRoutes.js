const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/authMiddleware");
const {
  getDepartmentStats,
  getInstitutionStats,
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

module.exports = router;
