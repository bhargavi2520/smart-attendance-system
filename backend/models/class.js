// models/class.js
"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Class extends Model {
    static associate(models) {
      // A class (section) has many students
      Class.hasMany(models.StudentProfile, {
        foreignKey: "classId",
        as: "students",
      });

      // A class is assigned many courses through the timetable
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
      department: {
        type: DataTypes.STRING,
      },
      year: {
        type: DataTypes.INTEGER,
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
