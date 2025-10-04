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
        allowNull: false,
        unique: true,
        references: { model: "users", key: "id" },
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
      tableName: "faculty_profiles",
      timestamps: true,
      underscored: true,
    }
  );

  return FacultyProfile;
};
