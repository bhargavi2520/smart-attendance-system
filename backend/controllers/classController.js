const { sequelize } = require("../models");
const db = require("../models");

exports.createClass = async (req, res) => {
  const { name, departmentId, year, inchargeId } = req.body;
  try {
    if (!name || !departmentId || !year) {
      return res
        .status(400)
        .json({ message: "Name, Department, and Year are required." });
    }
    const newClass = await db.Class.create({
      name,
      departmentId,
      year,
      inchargeId,
    });
    res.status(201).json(newClass);
  } catch (error) {
    console.error("Failed to create class:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// MODIFIED: This function now includes student count and associated names.
exports.getAllClasses = async (req, res) => {
  try {
    const classes = await db.Class.findAll({
      attributes: {
        include: [
          [sequelize.fn("COUNT", sequelize.col("students.id")), "studentCount"],
        ],
      },
      include: [
        {
          model: db.Department,
          as: "department",
          attributes: ["name"], // Only fetch the name
        },
        {
          model: db.User,
          as: "inCharge",
          attributes: ["name"], // Only fetch the name
        },
        {
          model: db.StudentProfile,
          as: "students",
          attributes: [], // Used only for counting, so no attributes needed
        },
      ],
      group: ["Class.id", "department.id", "inCharge.id"],
      order: [
        ["year", "DESC"],
        ["name", "ASC"],
      ],
    });
    res.json(classes);
  } catch (error) {
    console.error("Failed to get classes:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.getClassById = async (req, res) => {
  try {
    const singleClass = await db.Class.findByPk(req.params.id, {
      include: ["department", "inCharge"], // Also include details when fetching one
    });
    if (!singleClass)
      return res.status(404).json({ message: "Class not found" });
    res.json(singleClass);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateClass = async (req, res) => {
  try {
    const { name, departmentId, year, inchargeId } = req.body;
    const [updated] = await db.Class.update(
      { name, departmentId, year, inchargeId },
      { where: { id: req.params.id } }
    );
    if (!updated) return res.status(404).json({ message: "Class not found" });
    const updatedClass = await db.Class.findByPk(req.params.id);
    res.json(updatedClass);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteClass = async (req, res) => {
  try {
    const deleted = await db.Class.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ message: "Class not found" });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
