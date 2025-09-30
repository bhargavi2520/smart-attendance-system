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
      courseId: {
        type: DataTypes.INTEGER,
        field: "courseid",
      },
      facultyId: {
        type: DataTypes.INTEGER,
        field: "facultyid",
      },
      dayOfWeek: {
        type: DataTypes.STRING,
        field: "dayofweek",
      },
      startTime: {
        type: DataTypes.TIME,
        field: "starttime",
      },
      endTime: {
        type: DataTypes.TIME,
        field: "endtime",
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        field: "createdat",
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        field: "updatedat",
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
