"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Course extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Course.belongsToMany(models.User, {
        through: models.StudentCourse,
        foreignKey: "courseId",
      });
      Course.hasMany(models.Timetable, { foreignKey: "courseId" });
    }
  }
  Course.init(
    {
      courseName: DataTypes.STRING,
      courseCode: DataTypes.STRING,
      department: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Course",
    }
  );
  return Course;
};
