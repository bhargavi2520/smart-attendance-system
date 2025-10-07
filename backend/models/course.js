"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Course extends Model {
    static associate(models) {
      // A Course belongs to a Department
      Course.belongsTo(models.Department, {
        foreignKey: "departmentId",
        as: "department",
      });

      Course.belongsToMany(models.Class, {
        through: "Timetable",
        foreignKey: "courseId",
        otherKey: "classId",
        as: "classes",
      });
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
      departmentId: {
        type: DataTypes.INTEGER,
        references: {
          model: "departments",
          key: "id",
        },
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
