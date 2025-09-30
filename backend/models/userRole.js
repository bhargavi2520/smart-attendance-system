// models/userRole.js
"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class UserRole extends Model {
    static associate(models) {
      // You can define associations here if needed, for example:
      UserRole.belongsTo(models.User, { foreignKey: "userId" });
      UserRole.belongsTo(models.Role, { foreignKey: "roleId" });
    }
  }

  UserRole.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        references: {
          model: "users",
          key: "id",
        },
        primaryKey: true,
      },
      roleId: {
        type: DataTypes.INTEGER,
        references: {
          model: "roles",
          key: "id",
        },
        primaryKey: true,
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
