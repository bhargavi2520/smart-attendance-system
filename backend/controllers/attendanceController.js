// controllers/attendanceController.js
"use strict";
const db = require("../models");

exports.getFacultyTodayClasses = async (req, res) => {
  try {
    const facultyId = req.user.id;
    const today = new Date().toLocaleString("en-US", { weekday: "long" });

    const classes = await db.Timetable.findAll({
      where: { faculty_id: facultyId, day_of_week: today },
      include: [
        {
          model: db.Course,
          as: "course",
          // FIX: Use correct column 'name'/'code' and alias them for the frontend
          attributes: [
            ["name", "courseName"],
            ["code", "courseCode"],
          ],
        },
        {
          model: db.Class,
          as: "class",
          attributes: ["name", "year"], // Select attributes directly from the Class table
          include: [
            {
              model: db.Department,
              as: "department", // Use the association alias
              attributes: ["name"], // Select the 'name' from the Department table
            },
          ],
        },
      ],
      order: [["start_time", "ASC"]],
    });
    res.json(classes);
  } catch (error) {
    console.error("!!! ERROR in getFacultyTodayClasses:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getStudentsForSession = async (req, res) => {
  try {
    // const { timetableId } = req.params;
    const timetableId = parseInt(req.params.timetableId, 10);
    if (isNaN(timetableId)) {
      return res.status(400).json({ message: "Invalid timetable ID." });
    }

    const timetableEntry = await db.Timetable.findByPk(timetableId);
    if (!timetableEntry) {
      return res.status(404).json({ message: "Class session not found." });
    }

    const studentProfiles = await db.StudentProfile.findAll({
      where: { class_id: timetableEntry.classId },
      include: [
        { model: db.User, as: "user", attributes: ["id", "name", "email"] },
      ],
    });

    const students = studentProfiles.map((p) => p.user);
    res.json({ timetable: timetableEntry, students });
  } catch (error) {
    console.error("!!! ERROR in getStudentsForSession:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.markAttendance = async (req, res) => {
  const { timetableId, date, attendanceData } = req.body;
  const t = await db.sequelize.transaction();
  try {
    const existing = await db.Attendance.findAll({
      where: { timetable_id: timetableId, date },
    });
    if (existing.length > 0) {
      return res.status(409).json({
        message: "Attendance for this session has already been marked.",
      });
    }
    const records = attendanceData.map((record) => ({
      student_id: record.studentId,
      status: record.status,
      timetable_id: timetableId,
      date,
      marked_by: req.user.id,
    }));
    await db.Attendance.bulkCreate(records, { transaction: t });
    await t.commit();
    res.status(201).json({ message: "Attendance marked successfully." });
  } catch (error) {
    await t.rollback();
    console.error("!!! ERROR in markAttendance:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// FIX: Added placeholder functions to prevent server from crashing
exports.getStudentAttendance = async (req, res) => {
  res.status(501).json({ message: "Not implemented yet" });
};
exports.getStudentDetailedAttendance = async (req, res) => {
  res.status(501).json({ message: "Not implemented yet" });
};
