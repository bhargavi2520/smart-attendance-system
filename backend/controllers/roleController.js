// backend/controllers/roleController.js
const db = require("../models");

// @desc    Get all available roles
// @route   GET /api/roles
// @access  Private/Admin
exports.getAllRoles = async (req, res) => {
  try {
    const roles = await db.Role.findAll({
      order: [["name", "ASC"]],
    });
    res.json(roles);
  } catch (error) {
    console.error("Failed to fetch roles:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
