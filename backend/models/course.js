// models/course.js
"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Course extends Model {
    static associate(models) {
      // A course can be taught to many classes through the timetable
      Course.belongsToMany(models.Class, {
        through: "Timetable",
        foreignKey: "courseId",
        otherKey: "classId",
        as: "classes",
      });

      // A course has many scheduled sessions in the timetable
      Course.hasMany(models.Timetable, { foreignKey: "courseId" });
    }
  }
  Course.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      code: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
    },
    {
      sequelize,
      modelName: "Course",
      tableName: "courses",
      timestamps: true,
      underscored: true,
    }
  );
  return Course;
};
