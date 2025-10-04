// models/userRole.js
"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class UserRole extends Model {
    static associate(models) {
      UserRole.belongsTo(models.User, { foreignKey: "userId" });
      UserRole.belongsTo(models.Role, { foreignKey: "roleId" });
    }
  }

  UserRole.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: { model: "users", key: "id" },
      },
      roleId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: { model: "roles", key: "id" },
      },
    },
    {
      sequelize,
      modelName: "UserRole",
      tableName: "user_roles",
      timestamps: true,
      underscored: true,
    }
  );

  return UserRole;
};
