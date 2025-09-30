// models/user.js
"use strict";
const { Model } = require("sequelize");
const bcrypt = require("bcryptjs");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasOne(models.StudentProfile, {
        foreignKey: "userId",
        as: "studentProfile",
      });

      User.hasOne(models.FacultyProfile, {
        foreignKey: "userId",
        as: "facultyProfile",
      });

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
        field: "google_id", // <-- explicit mapping
      },
      passwordResetToken: {
        type: DataTypes.STRING,
        field: "password_reset_token", // <-- explicit mapping
      },
      passwordResetExpires: {
        type: DataTypes.DATE,
        field: "password_reset_expires", // <-- explicit mapping
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
