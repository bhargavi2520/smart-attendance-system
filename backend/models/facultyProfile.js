// models/facultyProfile.js
"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class FacultyProfile extends Model {
    static associate(models) {
      FacultyProfile.belongsTo(models.User, {
        foreignKey: "userId",
        as: "user",
      });
    }
  }

  FacultyProfile.init(
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
      department: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      designation: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "FacultyProfile",
      tableName: "facultyprofiles",
      timestamps: true,
    }
  );

  return FacultyProfile;
};
