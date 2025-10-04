// models/attendance.js
"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Attendance extends Model {
    static associate(models) {
      Attendance.belongsTo(models.User, {
        foreignKey: "studentId",
        as: "student",
      });
      Attendance.belongsTo(models.Timetable, { foreignKey: "timetableId" });
      Attendance.belongsTo(models.User, {
        foreignKey: "markedBy",
        as: "marker",
      });
    }
  }
  Attendance.init(
    {
      studentId: {
        type: DataTypes.INTEGER,
        references: { model: "users", key: "id" },
      },
      timetableId: {
        type: DataTypes.INTEGER,
        references: { model: "timetables", key: "id" },
      },
      date: {
        type: DataTypes.DATEONLY,
      },
      status: {
        type: DataTypes.ENUM("PRESENT", "ABSENT", "LATE"),
      },
      markedBy: {
        type: DataTypes.INTEGER,
        references: { model: "users", key: "id" },
      },
    },
    {
      sequelize,
      modelName: "Attendance",
      tableName: "attendances",
      timestamps: true,
      underscored: true,
    }
  );
  return Attendance;
};
