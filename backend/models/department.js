"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Department extends Model {
    static associate(models) {
      Department.hasMany(models.Class, {
        foreignKey: "departmentId",
        as: "classes",
      });
      Department.hasMany(models.FacultyProfile, {
        foreignKey: "departmentId",
        as: "faculty",
      });
      Department.hasOne(models.User, {
        foreignKey: "id",
        as: "hod",
      });
    }
  }
  Department.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      hodId: {
        type: DataTypes.INTEGER,
        references: {
          model: "users",
          key: "id",
        },
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Department",
      tableName: "departments",
      timestamps: true,
      underscored: true,
    }
  );
  return Department;
};
