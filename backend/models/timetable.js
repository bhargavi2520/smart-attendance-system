"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Timetable extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Timetable.belongsTo(models.Course, { foreignKey: "courseId" });
      Timetable.belongsTo(models.User, {
        foreignKey: "facultyId",
        as: "faculty",
      });
      Timetable.hasMany(models.Attendance, { foreignKey: "timetableId" });
    }
  }
  Timetable.init(
    {
      courseId: DataTypes.INTEGER,
      facultyId: DataTypes.INTEGER,
      dayOfWeek: DataTypes.STRING,
      startTime: DataTypes.TIME,
      endTime: DataTypes.TIME,
    },
    {
      sequelize,
      modelName: "Timetable",
    }
  );
  return Timetable;
};
