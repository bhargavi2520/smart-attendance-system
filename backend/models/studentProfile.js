// models/studentProfile.js
"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class StudentProfile extends Model {
    static associate(models) {
      // Each student profile belongs to one user
      StudentProfile.belongsTo(models.User, {
        foreignKey: "userId",
        as: "user",
      });

      // A student profile is part of one class (section)
      StudentProfile.belongsTo(models.Class, {
        foreignKey: "classId",
        as: "class",
      });
    }
  }

  StudentProfile.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
        references: { model: "users", key: "id" },
      },
      rollNumber: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      classId: {
        // The student's permanent class/section
        type: DataTypes.INTEGER,
        allowNull: true, // Can be nullable if student is not yet assigned
        references: { model: "classes", key: "id" },
      },
    },
    {
      sequelize,
      modelName: "StudentProfile",
      tableName: "student_profiles",
      timestamps: true,
      underscored: true,
    }
  );

  return StudentProfile;
};
