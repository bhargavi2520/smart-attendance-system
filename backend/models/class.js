// models/class.js
"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Class extends Model {
    static associate(models) {
      Class.belongsTo(models.Department, {
        foreignKey: "departmentId",
        as: "department",
      });
      Class.belongsTo(models.User, {
        foreignKey: "inchargeId",
        as: "inCharge",
      });
      Class.hasMany(models.StudentProfile, {
        foreignKey: "classId",
        as: "students",
      });
      Class.belongsToMany(models.Course, {
        through: "Timetable",
        foreignKey: "classId",
        otherKey: "courseId",
        as: "courses",
      });
    }
  }
  Class.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      departmentId: {
        type: DataTypes.INTEGER,
        references: { model: "departments", key: "id" },
      },
      year: {
        type: DataTypes.INTEGER,
      },
      inchargeId: {
        type: DataTypes.INTEGER,
        references: { model: "users", key: "id" },
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Class",
      tableName: "classes",
      timestamps: true,
      underscored: true,
    }
  );
  return Class;
};
