// seeders/20251002143755-complete-initial-data.js
"use strict";
const bcrypt = require("bcryptjs");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Clear all existing data in the correct order to avoid foreign key constraints
    await module.exports.down(queryInterface, Sequelize);

    const now = new Date();
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("password123", salt);

    // -- 1. CORE DATA (Roles, Departments, Classes, Courses) --

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

    const departments = [
      "Computer Science",
      "Mechanical",
      "Civil",
      "Electrical",
      "Chemical",
    ];
    const classesData = departments.map((dept, i) => ({
      id: i + 1,
      name: `Section ${String.fromCharCode(65 + i)}`,
      department: dept,
      year: 2025,
      created_at: now,
      updated_at: now,
    }));
    await queryInterface.bulkInsert("classes", classesData);

    const coursesData = [
      {
        id: 1,
        name: "Data Structures",
        code: "CS201",
        created_at: now,
        updated_at: now,
      },
      {
        id: 2,
        name: "Algorithms",
        code: "CS202",
        created_at: now,
        updated_at: now,
      },
      {
        id: 3,
        name: "Thermodynamics",
        code: "ME201",
        created_at: now,
        updated_at: now,
      },
      {
        id: 4,
        name: "Fluid Mechanics",
        code: "ME202",
        created_at: now,
        updated_at: now,
      },
      {
        id: 5,
        name: "Structural Analysis",
        code: "CE201",
        created_at: now,
        updated_at: now,
      },
      {
        id: 6,
        name: "Geotechnical Engineering",
        code: "CE202",
        created_at: now,
        updated_at: now,
      },
      {
        id: 7,
        name: "Circuit Theory",
        code: "EE201",
        created_at: now,
        updated_at: now,
      },
      {
        id: 8,
        name: "Power Systems",
        code: "EE202",
        created_at: now,
        updated_at: now,
      },
      {
        id: 9,
        name: "Chemical Process Principles",
        code: "CH201",
        created_at: now,
        updated_at: now,
      },
      {
        id: 10,
        name: "Mass Transfer",
        code: "CH202",
        created_at: now,
        updated_at: now,
      },
    ];
    await queryInterface.bulkInsert("courses", coursesData);

    // -- 2. DYNAMICALLY GENERATE USERS & PROFILES --

    const users = [];
    const facultyProfiles = [];
    const studentProfiles = [];
    const userRoles = [];
    let userIdCounter = 1;

    // A. Principal, Admin, and your specific users
    users.push(
      {
        id: userIdCounter++,
        name: "Dr. Evelyn Reed",
        email: "principal@test.com",
        password: hashedPassword,
        created_at: now,
        updated_at: now,
      },
      {
        id: userIdCounter++,
        name: "Site Admin",
        email: "admin@test.com",
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
      }
    );
    facultyProfiles.push(
      {
        user_id: 1,
        department: "Administration",
        designation: "Principal",
        created_at: now,
        updated_at: now,
      },
      {
        user_id: 2,
        department: "Administration",
        designation: "Administrator",
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
      }
    );
    userRoles.push(
      { user_id: 1, role_id: 2, created_at: now, updated_at: now }, // Principal
      { user_id: 2, role_id: 1, created_at: now, updated_at: now }, // Admin
      { user_id: 1001, role_id: 4, created_at: now, updated_at: now },
      { user_id: 1001, role_id: 5, created_at: now, updated_at: now },
      { user_id: 1002, role_id: 1, created_at: now, updated_at: now },
      { user_id: 1002, role_id: 2, created_at: now, updated_at: now },
      { user_id: 1002, role_id: 3, created_at: now, updated_at: now },
      { user_id: 1002, role_id: 4, created_at: now, updated_at: now },
      { user_id: 1002, role_id: 5, created_at: now, updated_at: now }
    );
    userIdCounter = 1003; // Reset counter to avoid clashes with hardcoded IDs

    // B. Generate Faculty for each department (HOD, Incharge, 2 Staff)
    const facultyMap = {};
    departments.forEach((dept) => {
      facultyMap[dept] = [];
      const deptCode = dept.substring(0, 2).toLowerCase();

      const hodId = userIdCounter++;
      users.push({
        id: hodId,
        name: `Dr. ${dept} HOD`,
        email: `hod.${deptCode}@test.com`,
        password: hashedPassword,
        created_at: now,
        updated_at: now,
      });
      facultyProfiles.push({
        user_id: hodId,
        department: dept,
        designation: "HOD",
        created_at: now,
        updated_at: now,
      });
      userRoles.push(
        { user_id: hodId, role_id: 3, created_at: now, updated_at: now },
        { user_id: hodId, role_id: 5, created_at: now, updated_at: now }
      );
      facultyMap[dept].push(hodId);

      const inchargeId = userIdCounter++;
      users.push({
        id: inchargeId,
        name: `Prof. ${dept} Incharge`,
        email: `incharge.${deptCode}@test.com`,
        password: hashedPassword,
        created_at: now,
        updated_at: now,
      });
      facultyProfiles.push({
        user_id: inchargeId,
        department: dept,
        designation: "Class Incharge",
        created_at: now,
        updated_at: now,
      });
      userRoles.push(
        { user_id: inchargeId, role_id: 4, created_at: now, updated_at: now },
        { user_id: inchargeId, role_id: 5, created_at: now, updated_at: now }
      );
      facultyMap[dept].push(inchargeId);

      for (let i = 1; i <= 2; i++) {
        const facultyId = userIdCounter++;
        users.push({
          id: facultyId,
          name: `Prof. ${dept} Faculty ${i}`,
          email: `faculty.${deptCode}${i}@test.com`,
          password: hashedPassword,
          created_at: now,
          updated_at: now,
        });
        facultyProfiles.push({
          user_id: facultyId,
          department: dept,
          designation: "Professor",
          created_at: now,
          updated_at: now,
        });
        userRoles.push({
          user_id: facultyId,
          role_id: 5,
          created_at: now,
          updated_at: now,
        });
        facultyMap[dept].push(facultyId);
      }
    });

    // C. Generate 15 Students for each Class with Realistic Names
    const studentNames = [
      "Aarav Sharma",
      "Vivaan Singh",
      "Aditya Kumar",
      "Vihaan Gupta",
      "Arjun Patel",
      "Sai Reddy",
      "Reyansh Mishra",
      "Krishna Verma",
      "Ishaan Yadav",
      "Ayaan Khan",
      "Advik Jain",
      "Kabir Shah",
      "Ansh Tiwari",
      "Dhruv Dubey",
      "Aadi Joshi",
      "Diya Mehta",
      "Saanvi Agarwal",
      "Aanya Sharma",
      "Myra Singh",
      "Aarohi Patel",
      "Anika Reddy",
      "Navya Gupta",
      "Siya Verma",
      "Pari Mishra",
      "Riya Khan",
      "Anvi Jain",
      "Ira Shah",
      "Sia Tiwari",
      "Kiara Dubey",
      "Amaira Joshi",
      "Liam Smith",
      "Olivia Johnson",
      "Noah Williams",
      "Emma Brown",
      "Oliver Jones",
      "Ava Garcia",
      "Elijah Miller",
      "Charlotte Davis",
      "William Rodriguez",
      "Sophia Martinez",
      "James Hernandez",
      "Amelia Lopez",
      "Benjamin Gonzalez",
      "Mia Wilson",
      "Lucas Anderson",
      "Isabella Taylor",
      "Henry Thomas",
      "Evelyn Moore",
      "Alexander Jackson",
      "Harper Martin",
      "Sebastian Lee",
      "Camila Perez",
      "Jack Thompson",
      "Abigail White",
      "Owen Harris",
      "Emily Sanchez",
      "Theodore Clark",
      "Ella Lewis",
      "Samuel Robinson",
      "Avery Walker",
      "Daniel Young",
      "Sofia Allen",
      "Matthew King",
      "Aria Wright",
      "Joseph Scott",
      "Luna Green",
      "David Baker",
      "Chloe Adams",
      "Leo Nelson",
      "Grace Carter",
      "Ryan Mitchell",
      "Riley Perez",
      "Luke Roberts",
      "Zoey Turner",
      "John Phillips",
    ];
    let nameIndex = 0;

    classesData.forEach((classInfo) => {
      for (let i = 1; i <= 15; i++) {
        const studentId = userIdCounter++;
        const rollNumber = `${classInfo.department
          .substring(0, 2)
          .toUpperCase()}${classInfo.year - 2023}0${classInfo.id}${String(
          i
        ).padStart(2, "0")}`;

        const studentName = studentNames[nameIndex++] || `Student ${studentId}`; // Fallback name

        users.push({
          id: studentId,
          name: studentName,
          email: `student.${rollNumber.toLowerCase()}@test.com`,
          password: hashedPassword,
          created_at: now,
          updated_at: now,
        });
        studentProfiles.push({
          user_id: studentId,
          roll_number: rollNumber,
          class_id: classInfo.id,
          created_at: now,
          updated_at: now,
        });
        userRoles.push({
          user_id: studentId,
          role_id: 6,
          created_at: now,
          updated_at: now,
        });
      }
    });

    await queryInterface.bulkInsert("users", users);
    await queryInterface.bulkInsert("faculty_profiles", facultyProfiles);
    await queryInterface.bulkInsert("student_profiles", studentProfiles);
    await queryInterface.bulkInsert("user_roles", userRoles);

    // -- 3. TIMETABLES & ATTENDANCE --

    const timetables = [
      // CS Class Timetable
      {
        id: 1,
        course_id: 1,
        class_id: 1,
        faculty_id: facultyMap["Computer Science"][0],
        semester: 1,
        day_of_week: "Monday",
        start_time: "09:00",
        end_time: "10:00",
        created_at: now,
        updated_at: now,
      },
      {
        id: 2,
        course_id: 2,
        class_id: 1,
        faculty_id: facultyMap["Computer Science"][1],
        semester: 1,
        day_of_week: "Tuesday",
        start_time: "10:00",
        end_time: "11:00",
        created_at: now,
        updated_at: now,
      },
      // Mechanical Class Timetable
      {
        id: 3,
        course_id: 3,
        class_id: 2,
        faculty_id: facultyMap["Mechanical"][2],
        semester: 1,
        day_of_week: "Monday",
        start_time: "11:00",
        end_time: "12:00",
        created_at: now,
        updated_at: now,
      },
      {
        id: 4,
        course_id: 4,
        class_id: 2,
        faculty_id: facultyMap["Mechanical"][3],
        semester: 1,
        day_of_week: "Wednesday",
        start_time: "09:00",
        end_time: "10:00",
        created_at: now,
        updated_at: now,
      },
      // Civil Class Timetable
      {
        id: 5,
        course_id: 5,
        class_id: 3,
        faculty_id: facultyMap["Civil"][0],
        semester: 1,
        day_of_week: "Tuesday",
        start_time: "13:00",
        end_time: "14:00",
        created_at: now,
        updated_at: now,
      },
      {
        id: 6,
        course_id: 6,
        class_id: 3,
        faculty_id: facultyMap["Civil"][1],
        semester: 1,
        day_of_week: "Thursday",
        start_time: "14:00",
        end_time: "15:00",
        created_at: now,
        updated_at: now,
      },
      // Electrical Class Timetable
      {
        id: 7,
        course_id: 7,
        class_id: 4,
        faculty_id: facultyMap["Electrical"][2],
        semester: 1,
        day_of_week: "Wednesday",
        start_time: "10:00",
        end_time: "11:00",
        created_at: now,
        updated_at: now,
      },
      {
        id: 8,
        course_id: 8,
        class_id: 4,
        faculty_id: facultyMap["Electrical"][3],
        semester: 1,
        day_of_week: "Friday",
        start_time: "11:00",
        end_time: "12:00",
        created_at: now,
        updated_at: now,
      },
      // Chemical Class Timetable
      {
        id: 9,
        course_id: 9,
        class_id: 5,
        faculty_id: facultyMap["Chemical"][0],
        semester: 1,
        day_of_week: "Thursday",
        start_time: "09:00",
        end_time: "10:00",
        created_at: now,
        updated_at: now,
      },
      {
        id: 10,
        course_id: 10,
        class_id: 5,
        faculty_id: facultyMap["Chemical"][1],
        semester: 1,
        day_of_week: "Friday",
        start_time: "14:00",
        end_time: "15:00",
        created_at: now,
        updated_at: now,
      },
    ];
    await queryInterface.bulkInsert("timetables", timetables);

    // Sample Attendance for Timetable ID 1 (CS Class 1)
    const studentProfilesForClass1 = studentProfiles.filter(
      (p) => p.class_id === 1
    );
    const attendanceData = studentProfilesForClass1
      .slice(0, 10)
      .map((profile) => ({
        // Mark attendance for first 10 students
        student_id: profile.user_id,
        timetable_id: 1,
        date: new Date().toISOString().split("T")[0],
        status: Math.random() > 0.3 ? "PRESENT" : "ABSENT",
        marked_by: facultyMap["Computer Science"][0],
        created_at: now,
        updated_at: now,
      }));
    await queryInterface.bulkInsert("attendances", attendanceData);
  },

  down: async (queryInterface, Sequelize) => {
    // Must be in reverse order of creation due to foreign keys
    await queryInterface.bulkDelete("attendances", null, {});
    await queryInterface.bulkDelete("timetables", null, {});
    await queryInterface.bulkDelete("courses", null, {});
    await queryInterface.bulkDelete("user_roles", null, {});
    await queryInterface.bulkDelete("student_profiles", null, {});
    await queryInterface.bulkDelete("faculty_profiles", null, {});
    await queryInterface.bulkDelete("classes", null, {});
    await queryInterface.bulkDelete("users", null, {});
    await queryInterface.bulkDelete("roles", null, {});
  },
};
