"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Users", "rollNumber", {
      type: Sequelize.STRING,
      allowNull: true,
      unique: true,
    });
    await queryInterface.addColumn("Users", "googleId", {
      type: Sequelize.STRING,
      allowNull: true,
      unique: true,
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Users", "rollNumber");
    await queryInterface.removeColumn("Users", "googleId");
  },
};
