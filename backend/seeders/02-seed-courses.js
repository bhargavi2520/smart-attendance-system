"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();
    await queryInterface.bulkInsert(
      "Courses",
      [
        {
          code: "CS101",
          name: "Computer Science 101",
          facultyId: 1,
          createdAt: now,
          updatedAt: now,
        },
        {
          code: "MA101",
          name: "Mathematics 101",
          facultyId: 1,
          createdAt: now,
          updatedAt: now,
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete(
      "Courses",
      {
        code: ["CS101", "MA101"],
      },
      {}
    );
  },
};
