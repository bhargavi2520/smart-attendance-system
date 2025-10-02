"use strict";
const bcrypt = require("bcryptjs");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const now = new Date();
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("Password123!", salt);

    // 1. Insert Roles
    await queryInterface.bulkInsert("roles", [
      {
        id: 1,
        name: "ADMIN",
        description: "Site Administrator",
        created_at: now,
        updated_at: now,
      },
      {
        id: 2,
        name: "PRINCIPAL",
        description: "Head of the Institution",
        created_at: now,
        updated_at: now,
      },
      {
        id: 3,
        name: "HOD",
        description: "Head of Department",
        created_at: now,
        updated_at: now,
      },
      {
        id: 4,
        name: "INCHARGE",
        description: "Class Incharge",
        created_at: now,
        updated_at: now,
      },
      {
        id: 5,
        name: "FACULTY",
        description: "Faculty Member",
        created_at: now,
        updated_at: now,
      },
      {
        id: 6,
        name: "STUDENT",
        description: "Student",
        created_at: now,
        updated_at: now,
      },
    ]);

    // 2. Insert Users
    await queryInterface.bulkInsert("users", [
      {
        id: 999,
        name: "Site Admin",
        email: "admin@test.com",
        password: hashedPassword,
        created_at: now,
        updated_at: now,
      },
      {
        id: 1,
        name: "Dr. Evelyn Reed",
        email: "principal@test.com",
        password: hashedPassword,
        created_at: now,
        updated_at: now,
      },
      {
        id: 2,
        name: "Dr. Alan Grant",
        email: "hod@test.com",
        password: hashedPassword,
        created_at: now,
        updated_at: now,
      },
      {
        id: 5,
        name: "Prof. Robert Muldoon",
        email: "faculty@test.com",
        password: hashedPassword,
        created_at: now,
        updated_at: now,
      },
      {
        id: 101,
        name: "Ada Lovelace",
        email: "student@test.com",
        password: hashedPassword,
        created_at: now,
        updated_at: now,
      },
      {
        id: 1002,
        name: "Ms Pandu",
        email: "bhargavi5052@gmail.com",
        password: hashedPassword,
        created_at: now,
        updated_at: now,
      },
    ]);

    // 3. Insert Faculty Profiles
    await queryInterface.bulkInsert("faculty_profiles", [
      {
        user_id: 999,
        department: "Administration",
        designation: "Administrator",
        created_at: now,
        updated_at: now,
      },
      {
        user_id: 1,
        department: "Administration",
        designation: "Principal",
        created_at: now,
        updated_at: now,
      },
      {
        user_id: 2,
        department: "Computer Science",
        designation: "HOD",
        created_at: now,
        updated_at: now,
      },
      {
        user_id: 5,
        department: "Computer Science",
        designation: "Professor",
        created_at: now,
        updated_at: now,
      },
      {
        user_id: 1002,
        department: "Administration",
        designation: "Principal",
        created_at: now,
        updated_at: now,
      },
    ]);

    // 4. Insert Student Profiles
    await queryInterface.bulkInsert("student_profiles", [
      {
        user_id: 101,
        roll_number: "CS101",
        department: "Computer Science",
        created_at: now,
        updated_at: now,
      },
    ]);

    // 5. Insert User Roles
    await queryInterface.bulkInsert("user_roles", [
      { user_id: 999, role_id: 1, created_at: now, updated_at: now },
      { user_id: 1, role_id: 2, created_at: now, updated_at: now },
      { user_id: 2, role_id: 3, created_at: now, updated_at: now },
      { user_id: 2, role_id: 5, created_at: now, updated_at: now }, // HOD is also a faculty
      { user_id: 5, role_id: 5, created_at: now, updated_at: now },
      { user_id: 101, role_id: 6, created_at: now, updated_at: now },
      { user_id: 1002, role_id: 1, created_at: now, updated_at: now }, // Ms Pandu has all roles
      { user_id: 1002, role_id: 2, created_at: now, updated_at: now },
      { user_id: 1002, role_id: 3, created_at: now, updated_at: now },
      { user_id: 1002, role_id: 4, created_at: now, updated_at: now },
      { user_id: 1002, role_id: 5, created_at: now, updated_at: now },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    // Commands to revert seed
    await queryInterface.bulkDelete("user_roles", null, {});
    await queryInterface.bulkDelete("student_profiles", null, {});
    await queryInterface.bulkDelete("faculty_profiles", null, {});
    await queryInterface.bulkDelete("users", null, {});
    await queryInterface.bulkDelete("roles", null, {});
  },
};
