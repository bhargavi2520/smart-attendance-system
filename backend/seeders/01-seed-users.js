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
      "users",
      [
        {
          id: 999,
          name: "Site Admin",
          email: "admin@test.com",
          password: password,
          google_id: null,
          password_reset_token: null,
          password_reset_expires: null,
          created_at: now,
          updated_at: now,
        },
        {
          id: 1,
          name: "Dr. Evelyn Reed",
          email: "principal@test.com",
          password: password,
          google_id: null,
          password_reset_token: null,
          password_reset_expires: null,
          created_at: now,
          updated_at: now,
        },
        {
          id: 2,
          name: "Dr. Alan Grant",
          email: "hod@test.com",
          password: password,
          google_id: null,
          password_reset_token: null,
          password_reset_expires: null,
          created_at: now,
          updated_at: now,
        },

        // STUDENTS (ID: 101 - 105) - MODIFIED
        {
          id: 101,
          name: "Ada Lovelace",
          email: "student@test.com",
          password: password,
          google_id: null,
          password_reset_token: null,
          password_reset_expires: null,
          created_at: now,
          updated_at: now,
        },
        {
          id: 102,
          name: "Charles Babbage",
          email: "student2@test.com",
          password: password,
          google_id: null,
          password_reset_token: null,
          password_reset_expires: null,
          created_at: now,
          updated_at: now,
        },
        {
          id: 103,
          name: "Grace Hopper",
          email: "student3@test.com",
          password: password,
          google_id: null,
          password_reset_token: null,
          password_reset_expires: null,
          created_at: now,
          updated_at: now,
        },
        {
          id: 104,
          name: "James Watt",
          email: "student.mech@test.com",
          password: password,
          google_id: null,
          password_reset_token: null,
          password_reset_expires: null,
          created_at: now,
          updated_at: now,
        },
        {
          id: 105,
          name: "Nikola Tesla",
          email: "student.mech2@test.com",
          password: password,
          google_id: null,
          password_reset_token: null,
          password_reset_expires: null,
          created_at: now,
          updated_at: now,
        },

        // Additional Users from the suggested code change
        {
          id: 106,
          name: "Alice Faculty",
          email: "alice.faculty@example.com",
          password: await hashPassword("hashedpassword1"),
          google_id: null,
          password_reset_token: null,
          password_reset_expires: null,
          created_at: now,
          updated_at: now,
        },
        {
          id: 107,
          name: "Bob Student",
          email: "bob.student@example.com",
          password: await hashPassword("hashedpassword2"),
          google_id: null,
          password_reset_token: null,
          password_reset_expires: null,
          created_at: now,
          updated_at: now,
        },
        {
          id: 108,
          name: "Carol Hod",
          email: "carol.hod@example.com",
          password: await hashPassword("hashedpassword3"),
          google_id: null,
          password_reset_token: null,
          password_reset_expires: null,
          created_at: now,
          updated_at: now,
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("users", null, {});
  },
};
