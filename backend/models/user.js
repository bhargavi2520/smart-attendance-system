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
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "name",
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        field: "email",
      },
      rollNumber: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: true, // Allow null for non-students
        field: "rollnumber",
      },
      googleId: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: true,
        field: "googleid",
      },
      password: {
        type: DataTypes.STRING,
        allowNull: true, // Allow null for users who only use Google login
        field: "password",
      },
      role: {
        type: DataTypes.ENUM(
          "ADMIN",
          "STUDENT",
          "FACULTY",
          "INCHARGE",
          "HOD",
          "PRINCIPAL"
        ),
        allowNull: false,
        field: "role",
      },
      department: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "department",
      },
      passwordResetToken: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "passwordresettoken",
      },
      passwordResetExpires: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "passwordresetexpires",
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
      modelName: "User",
      tableName: "users",
      timestamps: true,
      createdAt: "createdAt",
      updatedAt: "updatedAt",
      hooks: {
        beforeCreate: async (user) => {
          if (user.password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(user.password, salt);
          }
        },
        beforeUpdate: async (user) => {
          if (user.changed("password") && user.password) {
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
