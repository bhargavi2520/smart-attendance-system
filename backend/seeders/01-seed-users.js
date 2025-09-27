"use strict";
const bcrypt = require("bcryptjs");

const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const password = await hashPassword("password123");
    const now = new Date();

    await queryInterface.bulkInsert(
      "Users",
      [
        // PRINCIPAL (ID: 1)
        {
          id: 1,
          name: "Dr. Evelyn Reed",
          email: "principal@test.com",
          password: password,
          role: "PRINCIPAL",
          department: null,
          createdAt: now,
          updatedAt: now,
        },

        // HODs (ID: 2, 3)
        {
          id: 2,
          name: "Dr. Alan Grant",
          email: "hod@test.com",
          password: password,
          role: "HOD",
          department: "Computer Science",
          createdAt: now,
          updatedAt: now,
        },
        {
          id: 3,
          name: "Dr. Ellie Sattler",
          email: "hod.mech@test.com",
          password: password,
          role: "HOD",
          department: "Mechanical",
          createdAt: now,
          updatedAt: now,
        },

        // INCHARGE (ID: 4)
        {
          id: 4,
          name: "Prof. Ian Malcolm",
          email: "incharge@test.com",
          password: password,
          role: "INCHARGE",
          department: "Computer Science",
          createdAt: now,
          updatedAt: now,
        },

        // FACULTY (ID: 5, 6, 7)
        {
          id: 5,
          name: "Prof. Robert Muldoon",
          email: "faculty@test.com",
          password: password,
          role: "FACULTY",
          department: "Computer Science",
          createdAt: now,
          updatedAt: now,
        },
        {
          id: 6,
          name: "Prof. Dennis Nedry",
          email: "faculty2@test.com",
          password: password,
          role: "FACULTY",
          department: "Computer Science",
          createdAt: now,
          updatedAt: now,
        },
        {
          id: 7,
          name: "Prof. John Hammond",
          email: "faculty.mech@test.com",
          password: password,
          role: "FACULTY",
          department: "Mechanical",
          createdAt: now,
          updatedAt: now,
        },

        // STUDENTS (ID: 101 - 105)
        {
          id: 101,
          name: "Ada Lovelace",
          email: "student@test.com",
          password: password,
          role: "STUDENT",
          department: "Computer Science",
          createdAt: now,
          updatedAt: now,
        },
        {
          id: 102,
          name: "Charles Babbage",
          email: "student2@test.com",
          password: password,
          role: "STUDENT",
          department: "Computer Science",
          createdAt: now,
          updatedAt: now,
        },
        {
          id: 103,
          name: "Grace Hopper",
          email: "student3@test.com",
          password: password,
          role: "STUDENT",
          department: "Computer Science",
          createdAt: now,
          updatedAt: now,
        },
        {
          id: 104,
          name: "James Watt",
          email: "student.mech@test.com",
          password: password,
          role: "STUDENT",
          department: "Mechanical",
          createdAt: now,
          updatedAt: now,
        },
        {
          id: 105,
          name: "Nikola Tesla",
          email: "student.mech2@test.com",
          password: password,
          role: "STUDENT",
          department: "Mechanical",
          createdAt: now,
          updatedAt: now,
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Users", null, {});
  },
};
