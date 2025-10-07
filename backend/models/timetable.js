// models/timetable.js
"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Timetable extends Model {
    static associate(models) {
      Timetable.belongsTo(models.Course, {
        foreignKey: "courseId",
        as: "course",
      });
      Timetable.belongsTo(models.Class, { foreignKey: "classId", as: "class" });
      Timetable.belongsTo(models.User, {
        foreignKey: "facultyId",
        as: "faculty",
      });
      Timetable.hasMany(models.Attendance, {
        foreignKey: "timetableId",
        as: "Attendances", // Add this line
      });
    }
  }
  Timetable.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
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
