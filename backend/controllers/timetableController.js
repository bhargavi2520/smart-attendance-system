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

// @desc    Create, update, or delete a timetable entry (Upsert)
// @route   POST /api/timetables/entry
// @access  Private/Admin
exports.upsertTimetableEntry = async (req, res) => {
  const { classId, dayOfWeek, startTime, courseId, facultyId } = req.body;

  try {
    // Find if an entry already exists for this specific slot
    const existingEntry = await Timetable.findOne({
      where: { classId, dayOfWeek, startTime },
    });

    // If the user clears the fields (sets to "Free"), delete the entry
    if (existingEntry && (!courseId || !facultyId)) {
      await existingEntry.destroy();
      return res.status(204).send(); // 204 No Content for successful deletion
    }

    // If an entry exists and we have data, update it
    if (existingEntry) {
      existingEntry.courseId = courseId;
      existingEntry.facultyId = facultyId;
      await existingEntry.save();
      const updatedEntry = await Timetable.findByPk(existingEntry.id, {
        include: ["course", "faculty"],
      });
      return res.json(updatedEntry);
    }

    // If no entry exists and we have data, create a new one
    if (!existingEntry && courseId && facultyId) {
      const newEntry = await Timetable.create(
        { classId, dayOfWeek, startTime, courseId, facultyId },
        { include: ["course", "faculty"] }
      );
      const createdEntry = await Timetable.findByPk(newEntry.id, {
        include: ["course", "faculty"],
      });
      return res.status(201).json(createdEntry);
    }

    // If no entry exists and no data is provided, do nothing
    return res.status(200).json({ message: "No action taken." });
  } catch (error) {
    console.error("Failed to upsert timetable entry:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
