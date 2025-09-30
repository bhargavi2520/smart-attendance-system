// models/class.js
"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Class extends Model {
    static associate(models) {
      Class.belongsToMany(models.User, {
        through: "StudentClass",
        foreignKey: "classId",
        as: "students",
      });
    }
  }
  Class.init(
    {
      className: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      subjectCode: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
    },
    {
      sequelize,
      modelName: "Class",
      tableName: "classes",
      timestamps: true,
      underscored: true,
    }
  );
  return Class;
};
