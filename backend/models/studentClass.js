// models/studentClass.js
"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class StudentClass extends Model {
    static associate(models) {
      StudentClass.belongsTo(models.StudentProfile, {
        foreignKey: "studentId",
      });
      StudentClass.belongsTo(models.Class, { foreignKey: "classId" });
    }
  }

  StudentClass.init(
    {
      studentId: {
        type: DataTypes.INTEGER,
        references: {
          model: "studentprofiles",
          key: "id",
        },
        primaryKey: true,
      },
      classId: {
        type: DataTypes.INTEGER,
        references: {
          model: "classes",
          key: "id",
        },
        primaryKey: true,
      },
    },
    {
      sequelize,
      modelName: "StudentClass",
      tableName: "studentclasses",
      timestamps: true,
    }
  );

  return StudentClass;
};
