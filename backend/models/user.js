"use strict";
const { Model } = require("sequelize");
const bcrypt = require("bcryptjs");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.belongsToMany(models.Course, {
        through: models.StudentCourse,
        foreignKey: "studentId",
        as: "studentCourses",
      });
      User.hasMany(models.Timetable, {
        foreignKey: "facultyId",
        as: "facultyClasses",
      });
    }
  }
  User.init(
    {
      name: DataTypes.STRING,
      email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      // ADD rollNumber
      rollNumber: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: true, // Allow null for non-students
      },
      // ADD googleId
      googleId: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: true, // Allow null for users who only use Google login
      },
      role: {
        type: DataTypes.ENUM(
          "STUDENT",
          "FACULTY",
          "INCHARGE",
          "HOD",
          "PRINCIPAL"
        ),
        allowNull: false,
      },
      department: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "User",
      hooks: {
        beforeCreate: async (user) => {
          if (user.password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(user.password, salt);
          }
        },
      },
    }
  );

  User.prototype.validPassword = async function (password) {
    if (!this.password) return false;
    return await bcrypt.compare(password, this.password);
  };

  return User;
};
