"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();
    // Use the exact current day for testing `today` endpoints
    const today = new Date().toLocaleString("en-us", { weekday: "long" });

    await queryInterface.bulkInsert(
      "Timetables",
      [
        // CS101 by Faculty 5 on today
        {
          id: 1,
          courseId: 1,
          facultyId: 5,
          dayOfWeek: today,
          startTime: "09:00:00",
          endTime: "10:00:00",
          createdAt: now,
          updatedAt: now,
        },
        // CS102 by Faculty 6 on today
        {
          id: 2,
          courseId: 2,
          facultyId: 6,
          dayOfWeek: today,
          startTime: "11:00:00",
          endTime: "12:00:00",
          createdAt: now,
          updatedAt: now,
        },
        // ME101 by Faculty 7 on today
        {
          id: 3,
          courseId: 3,
          facultyId: 7,
          dayOfWeek: today,
          startTime: "10:00:00",
          endTime: "11:00:00",
          createdAt: now,
          updatedAt: now,
        },

        // Other days
        {
          id: 4,
          courseId: 1,
          facultyId: 5,
          dayOfWeek: "Wednesday",
          startTime: "14:00:00",
          endTime: "15:00:00",
          createdAt: now,
          updatedAt: now,
        },
        {
          id: 5,
          courseId: 4,
          facultyId: 7,
          dayOfWeek: "Friday",
          startTime: "09:00:00",
          endTime: "10:00:00",
          createdAt: now,
          updatedAt: now,
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Timetables", null, {});
  },
};
