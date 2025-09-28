"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();
    await queryInterface.bulkInsert(
      "StudentCourses",
      [
        // CS Students (101, 102, 103) in CS courses (1, 2)
        { studentId: 101, courseId: 1, createdAt: now, updatedAt: now },
        { studentId: 101, courseId: 2, createdAt: now, updatedAt: now },
        { studentId: 102, courseId: 1, createdAt: now, updatedAt: now },
        { studentId: 102, courseId: 2, createdAt: now, updatedAt: now },
        { studentId: 103, courseId: 1, createdAt: now, updatedAt: now },
        { studentId: 103, courseId: 2, createdAt: now, updatedAt: now },

        // ME Students (104, 105) in ME courses (3, 4)
        { studentId: 104, courseId: 3, createdAt: now, updatedAt: now },
        { studentId: 104, courseId: 4, createdAt: now, updatedAt: now },
        { studentId: 105, courseId: 3, createdAt: now, updatedAt: now },
        { studentId: 105, courseId: 4, createdAt: now, updatedAt: now },

        // Additional entry for studentId 2
        {
          studentId: 2,
          courseId: 1,
          createdAt: now,
          updatedAt: now,
        },
        {
          studentId: 2,
          courseId: 2,
          createdAt: now,
          updatedAt: now,
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("StudentCourses", null, {});
  },
};
