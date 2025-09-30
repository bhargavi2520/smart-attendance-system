// models/studentProfile.js
"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class StudentProfile extends Model {
    static associate(models) {
      StudentProfile.belongsTo(models.User, {
        foreignKey: "userId",
        as: "user",
      });

      StudentProfile.belongsToMany(models.Class, {
        through: "StudentClass",
        foreignKey: "studentId",
        as: "classes",
      });
    }
  }

  StudentProfile.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        references: {
          model: "users",
          key: "id",
        },
        allowNull: false,
        unique: true,
      },
      rollNumber: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      department: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "StudentProfile",
      tableName: "studentprofiles",
      timestamps: true,
      underscored: true,
    }
  );

  return StudentProfile;
};
