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
      },
      courseCode: {
        type: DataTypes.STRING,
      },
      department: {
        type: DataTypes.STRING,
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
      modelName: "Course",
      tableName: "courses",
      timestamps: true,
      underscored: true,
    }
  );
  return Course;
};
