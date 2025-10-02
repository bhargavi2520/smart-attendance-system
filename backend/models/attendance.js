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
      studentId: {
        type: DataTypes.INTEGER,
      },
      timetableId: {
        type: DataTypes.INTEGER,
      },
      date: {
        type: DataTypes.DATEONLY,
      },
      status: {
        type: DataTypes.ENUM("PRESENT", "ABSENT"),
      },
      markedBy: {
        type: DataTypes.INTEGER,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
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
