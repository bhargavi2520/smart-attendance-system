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
      studentId: {
        type: DataTypes.INTEGER,
        field: "studentid",
      },
      courseId: {
        type: DataTypes.INTEGER,
        field: "courseid",
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
      modelName: "StudentCourse",
      tableName: "student_courses",
      timestamps: true,
      underscored: true,
    }
  );
  return StudentCourse;
};
