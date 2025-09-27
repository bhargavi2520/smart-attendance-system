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
          rollNumber: null, // Non-students don't have a roll number
          googleId: null, // Initially null for all users
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
          rollNumber: null,
          googleId: null,
          password: password,
          role: "HOD",
          department: "Computer Science",
          createdAt: now,
          updatedAt: now,
        },
        // ... (other non-student users will also have rollNumber: null)

        // STUDENTS (ID: 101 - 105) - MODIFIED
        {
          id: 101,
          name: "Ada Lovelace",
          email: "student@test.com",
          rollNumber: "CS101", // ADD a unique roll number for each student
          googleId: null,
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
          rollNumber: "CS102", // ADD a unique roll number
          googleId: null,
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
          rollNumber: "CS103", // ADD a unique roll number
          googleId: null,
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
          rollNumber: "ME101", // ADD a unique roll number
          googleId: null,
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
          rollNumber: "ME102", // ADD a unique roll number
          googleId: null,
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
