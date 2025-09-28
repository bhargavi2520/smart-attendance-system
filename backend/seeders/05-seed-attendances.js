"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();
    // Create dates for the last few days to make the data realistic
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const twoDaysAgo = new Date(today);
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

    await queryInterface.bulkInsert(
      "Attendances",
      [
        // Attendance for Course 1 (e.g., Data Structures) two days ago
        {
          studentId: 101,
          courseId: 1,
          date: twoDaysAgo,
          status: "Present",
          createdAt: now,
          updatedAt: now,
        },
        {
          studentId: 102,
          courseId: 1,
          date: twoDaysAgo,
          status: "Present",
          createdAt: now,
          updatedAt: now,
        },
        {
          studentId: 103,
          courseId: 1,
          date: twoDaysAgo,
          status: "Absent",
          createdAt: now,
          updatedAt: now,
        },
        {
          studentId: 2,
          courseId: 1,
          date: twoDaysAgo,
          status: "Present",
          createdAt: now,
          updatedAt: now,
        },

        // Attendance for Course 2 (e.g., Algorithms) yesterday
        {
          studentId: 101,
          courseId: 2,
          date: yesterday,
          status: "Present",
          createdAt: now,
          updatedAt: now,
        },
        {
          studentId: 102,
          courseId: 2,
          date: yesterday,
          status: "Absent",
          createdAt: now,
          updatedAt: now,
        },
        {
          studentId: 2,
          courseId: 2,
          date: yesterday,
          status: "Present",
          createdAt: now,
          updatedAt: now,
        },

        // Attendance for Course 3 (e.g., Thermodynamics) today
        {
          studentId: 104,
          courseId: 3,
          date: today,
          status: "Present",
          createdAt: now,
          updatedAt: now,
        },
        {
          studentId: 105,
          courseId: 3,
          date: today,
          status: "Present",
          createdAt: now,
          updatedAt: now,
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    // This will remove all entries from the Attendances table
    await queryInterface.bulkDelete("Attendances", null, {});
  },
};
