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
      courseName: {
        type: DataTypes.STRING,
        field: "coursename",
      },
      courseCode: {
        type: DataTypes.STRING,
        field: "coursecode",
      },
      department: {
        type: DataTypes.STRING,
        field: "department",
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
      modelName: "Course",
      tableName: "courses",
      timestamps: true,
      underscored: true,
    }
  );
  return Course;
};
