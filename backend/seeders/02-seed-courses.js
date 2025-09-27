"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();
    await queryInterface.bulkInsert(
      "Courses",
      [
        // Computer Science (ID: 1, 2)
        {
          id: 1,
          courseName: "Data Structures",
          courseCode: "CS101",
          department: "Computer Science",
          createdAt: now,
          updatedAt: now,
        },
        {
          id: 2,
          courseName: "Algorithms",
          courseCode: "CS102",
          department: "Computer Science",
          createdAt: now,
          updatedAt: now,
        },

        // Mechanical (ID: 3, 4)
        {
          id: 3,
          courseName: "Thermodynamics",
          courseCode: "ME101",
          department: "Mechanical",
          createdAt: now,
          updatedAt: now,
        },
        {
          id: 4,
          courseName: "Fluid Mechanics",
          courseCode: "ME102",
          department: "Mechanical",
          createdAt: now,
          updatedAt: now,
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Courses", null, {});
  },
};
