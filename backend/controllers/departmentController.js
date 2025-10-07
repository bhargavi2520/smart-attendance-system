// controllers/departmentController.js
const db = require("../models");

exports.getAllDepartments = async (req, res) => {
  try {
    const departments = await db.Department.findAll({
      order: [["name", "ASC"]],
    });
    res.json(departments);
  } catch (error) {
    console.error("Failed to get departments:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
