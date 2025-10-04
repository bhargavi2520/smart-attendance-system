// models/user.js
"use strict";
const { Model } = require("sequelize");
const bcrypt = require("bcryptjs");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // A user can have one student profile (if they are a student)
      User.hasOne(models.StudentProfile, {
        foreignKey: "userId",
        as: "studentProfile",
      });

      // A user can have one faculty profile (if they are faculty)
      User.hasOne(models.FacultyProfile, {
        foreignKey: "userId",
        as: "facultyProfile",
      });

      // A user can have multiple roles (e.g., HOD and Faculty)
      User.belongsToMany(models.Role, {
        through: "UserRole",
        foreignKey: "userId",
        as: "roles",
      });
    }
  }

  User.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      googleId: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: true,
      },
      passwordResetToken: {
        type: DataTypes.STRING,
      },
      passwordResetExpires: {
        type: DataTypes.DATE,
      },
    },
    {
      sequelize,
      modelName: "User",
      tableName: "users",
      timestamps: true,
      underscored: true,
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
