"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class StudentCourse extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      StudentCourse.belongsTo(models.User, {
        foreignKey: "studentId",
        as: "student",
      });
      StudentCourse.belongsTo(models.Course, {
        foreignKey: "courseId",
        as: "course",
      });
    }
  }
  StudentCourse.init(
    {
      studentId: DataTypes.INTEGER,
      courseId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "StudentCourse",
    }
  );
  return StudentCourse;
};
