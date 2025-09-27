"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Attendance extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Attendance.belongsTo(models.User, { foreignKey: "studentId" });
      Attendance.belongsTo(models.Timetable, { foreignKey: "timetableId" });
      Attendance.belongsTo(models.User, {
        foreignKey: "markedBy",
        as: "marker",
      });
    }
  }
  Attendance.init(
    {
      studentId: DataTypes.INTEGER,
      timetableId: DataTypes.INTEGER,
      date: DataTypes.DATEONLY,
      status: DataTypes.ENUM("PRESENT", "ABSENT"),
      markedBy: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Attendance",
    }
  );
  return Attendance;
};
