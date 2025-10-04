// models/timetable.js
"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Timetable extends Model {
    static associate(models) {
      Timetable.belongsTo(models.Course, { foreignKey: "courseId" });
      Timetable.belongsTo(models.Class, { foreignKey: "classId" });
      Timetable.belongsTo(models.User, {
        foreignKey: "facultyId",
        as: "faculty",
      });
      Timetable.hasMany(models.Attendance, { foreignKey: "timetableId" });
    }
  }
  Timetable.init(
    {
      courseId: {
        type: DataTypes.INTEGER,
        references: { model: "courses", key: "id" },
      },
      classId: {
        type: DataTypes.INTEGER,
        references: { model: "classes", key: "id" },
      },
      facultyId: {
        type: DataTypes.INTEGER,
        references: { model: "users", key: "id" },
      },
      dayOfWeek: {
        type: DataTypes.STRING,
      },
      startTime: {
        type: DataTypes.TIME,
      },
      endTime: {
        type: DataTypes.TIME,
      },
      semester: {
        type: DataTypes.INTEGER,
      },
    },
    {
      sequelize,
      modelName: "Timetable",
      tableName: "timetables",
      timestamps: true,
      underscored: true,
    }
  );
  return Timetable;
};
