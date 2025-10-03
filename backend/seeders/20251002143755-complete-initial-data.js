"use strict";
const bcrypt = require("bcryptjs");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Note: The down function only handles data deletion, not full table drops.
    // Assuming tables are managed by migrations before this seeder runs.
    await module.exports.down(queryInterface, Sequelize);

    const now = new Date();
    const salt = await bcrypt.genSalt(10);
    // Hashing a generic password for all mock users
    const hashedPassword = await bcrypt.hash("password123", salt);

    // 1. Insert Roles (Ensure IDs match SQL script)
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

    // 2. Insert Users (All 13 users from SQL script)
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
        id: 6,
        name: "Prof. Dennis Nedry",
        email: "faculty2@test.com",
        password: hashedPassword,
        created_at: now,
        updated_at: now,
      },
      {
        id: 7,
        name: "Prof. John Hammond",
        email: "faculty.mech@test.com",
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
        id: 102,
        name: "Charles Babbage",
        email: "student2@test.com",
        password: hashedPassword,
        created_at: now,
        updated_at: now,
      },
      {
        id: 103,
        name: "Grace Hopper",
        email: "student3@test.com",
        password: hashedPassword,
        created_at: now,
        updated_at: now,
      },
      {
        id: 104,
        name: "James Watt",
        email: "student.mech@test.com",
        password: hashedPassword,
        created_at: now,
        updated_at: now,
      },
      {
        id: 105,
        name: "Nikola Tesla",
        email: "student.mech2@test.com",
        password: hashedPassword,
        created_at: now,
        updated_at: now,
      },
      {
        id: 1001,
        name: "Mr Platypus",
        email: "saikiransandeep1@gmail.com",
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

    // 3. Insert Faculty Profiles (All 8 profiles from SQL script)
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
        user_id: 6,
        department: "Computer Science",
        designation: "Assistant Professor",
        created_at: now,
        updated_at: now,
      },
      {
        user_id: 7,
        department: "Mechanical",
        designation: "Professor",
        created_at: now,
        updated_at: now,
      },
      {
        user_id: 1001,
        department: "General",
        designation: "Faculty",
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

    // 4. Insert Student Profiles (All 5 profiles from SQL script)
    // IMPORTANT: Manually setting 'id' to match the 'student_id' references in the student_classes table
    await queryInterface.bulkInsert("student_profiles", [
      {
        id: 1,
        user_id: 101,
        roll_number: "CS101",
        department: "Computer Science",
        created_at: now,
        updated_at: now,
      },
      {
        id: 2,
        user_id: 102,
        roll_number: "CS102",
        department: "Computer Science",
        created_at: now,
        updated_at: now,
      },
      {
        id: 3,
        user_id: 103,
        roll_number: "CS103",
        department: "Computer Science",
        created_at: now,
        updated_at: now,
      },
      {
        id: 4,
        user_id: 104,
        roll_number: "ME101",
        department: "Mechanical",
        created_at: now,
        updated_at: now,
      },
      {
        id: 5,
        user_id: 105,
        roll_number: "ME102",
        department: "Mechanical",
        created_at: now,
        updated_at: now,
      },
    ]);

    // 5. Insert User Roles (All assignments from SQL script)
    await queryInterface.bulkInsert("user_roles", [
      { user_id: 999, role_id: 1, created_at: now, updated_at: now },
      { user_id: 1, role_id: 2, created_at: now, updated_at: now },
      { user_id: 2, role_id: 3, created_at: now, updated_at: now },
      { user_id: 2, role_id: 5, created_at: now, updated_at: now }, // Dr. Grant (HOD) is also Faculty
      { user_id: 5, role_id: 5, created_at: now, updated_at: now },
      { user_id: 6, role_id: 5, created_at: now, updated_at: now },
      { user_id: 7, role_id: 5, created_at: now, updated_at: now },
      { user_id: 101, role_id: 6, created_at: now, updated_at: now },
      { user_id: 102, role_id: 6, created_at: now, updated_at: now },
      { user_id: 103, role_id: 6, created_at: now, updated_at: now },
      { user_id: 104, role_id: 6, created_at: now, updated_at: now },
      { user_id: 105, role_id: 6, created_at: now, updated_at: now },
      { user_id: 1001, role_id: 5, created_at: now, updated_at: now }, // Mr. Platypus is Faculty
      { user_id: 1001, role_id: 4, created_at: now, updated_at: now }, // Mr. Platypus is Class Incharge
      // Ms Pandu has roles 1, 2, 3, 4, 5
      { user_id: 1002, role_id: 1, created_at: now, updated_at: now },
      { user_id: 1002, role_id: 2, created_at: now, updated_at: now },
      { user_id: 1002, role_id: 3, created_at: now, updated_at: now },
      { user_id: 1002, role_id: 4, created_at: now, updated_at: now },
      { user_id: 1002, role_id: 5, created_at: now, updated_at: now },
    ]);

    // 6. Insert Classes
    await queryInterface.bulkInsert("classes", [
      {
        id: 1,
        class_name: "Data Structures",
        subject_code: "CS101",
        created_at: now,
        updated_at: now,
      },
      {
        id: 2,
        class_name: "Algorithms",
        subject_code: "CS102",
        created_at: now,
        updated_at: now,
      },
      {
        id: 3,
        class_name: "Thermodynamics",
        subject_code: "ME101",
        created_at: now,
        updated_at: now,
      },
      {
        id: 4,
        class_name: "Fluid Mechanics",
        subject_code: "ME102",
        created_at: now,
        updated_at: now,
      },
    ]);

    // 7. Insert Student-Class Assignments
    // Uses student_profiles.id (1-5) and classes.id (1-4)
    await queryInterface.bulkInsert("student_classes", [
      { student_id: 1, class_id: 1, created_at: now, updated_at: now }, // Ada Lovelace (CS101) -> Data Structures
      { student_id: 1, class_id: 2, created_at: now, updated_at: now }, // Ada Lovelace (CS101) -> Algorithms
      { student_id: 2, class_id: 1, created_at: now, updated_at: now }, // Charles Babbage (CS102) -> Data Structures
      { student_id: 2, class_id: 2, created_at: now, updated_at: now }, // Charles Babbage (CS102) -> Algorithms
      { student_id: 3, class_id: 1, created_at: now, updated_at: now }, // Grace Hopper (CS103) -> Data Structures
      { student_id: 3, class_id: 2, created_at: now, updated_at: now }, // Grace Hopper (CS103) -> Algorithms
      { student_id: 4, class_id: 3, created_at: now, updated_at: now }, // James Watt (ME101) -> Thermodynamics
      { student_id: 4, class_id: 4, created_at: now, updated_at: now }, // James Watt (ME101) -> Fluid Mechanics
      { student_id: 5, class_id: 3, created_at: now, updated_at: now }, // Nikola Tesla (ME102) -> Thermodynamics
      { student_id: 5, class_id: 4, created_at: now, updated_at: now }, // Nikola Tesla (ME102) -> Fluid Mechanics
    ]);

    // Note: No mock data provided for timetables or attendances, so they are omitted here.
  },

  down: async (queryInterface, Sequelize) => {
    // Commands to revert seed in reverse dependency order
    await queryInterface.bulkDelete("student_classes", null, {});
    await queryInterface.bulkDelete("classes", null, {});
    await queryInterface.bulkDelete("user_roles", null, {});
    await queryInterface.bulkDelete("student_profiles", null, {});
    await queryInterface.bulkDelete("faculty_profiles", null, {});
    await queryInterface.bulkDelete("users", null, {});
    await queryInterface.bulkDelete("roles", null, {});
  },
};
