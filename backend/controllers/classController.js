// controllers/classController.js
const db = require("../models");
const { Class, Department, User } = db;

exports.getAllClasses = async (req, res) => {
  try {
    const classes = await Class.findAll({
      include: [
        { model: Department, as: "department", attributes: ["name"] },
        { model: User, as: "inCharge", attributes: ["id", "name"] },
      ],
      order: [
        ["year", "DESC"],
        ["name", "ASC"],
      ],
    });
    res.json(classes);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

exports.createClass = async (req, res) => {
  try {
    const newClass = await Class.create(req.body);
    res.status(201).json(newClass);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error creating class", error: error.message });
  }
};

exports.deleteClass = async (req, res) => {
  try {
    const classInstance = await Class.findByPk(req.params.id);
    if (!classInstance) {
      return res.status(404).json({ message: "Class not found" });
    }
    await classInstance.destroy();
    res.status(204).send(); // No content
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting class", error: error.message });
  }
};
