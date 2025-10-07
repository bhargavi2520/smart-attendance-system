const db = require("../models");
const Timetable = db.Timetable;

exports.getTimetableByClass = async (req, res) => {
  try {
    const { classId } = req.params;
    const timetable = await Timetable.findAll({
      where: { classId },
      include: [
        { model: db.Course, as: "course", attributes: ["name"] },
        { model: db.User, as: "faculty", attributes: ["name"] },
      ],
      order: [
        ["dayOfWeek", "ASC"],
        ["startTime", "ASC"],
      ],
    });
    res.json(timetable);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
