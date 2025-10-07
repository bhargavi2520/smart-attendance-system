"use strict";
const bcrypt = require("bcryptjs");

//prettier-ignore
const studentNames = ["Aarav Sharma","Vivaan Singh","Aditya Kumar","Vihaan Gupta","Arjun Patel","Sai Reddy","Reyansh Mishra","Krishna Verma","Ishaan Yadav","Ayaan Khan","Advik Jain","Kabir Shah","Ansh Tiwari","Dhruv Dubey","Aadi Joshi","Diya Mehta","Saanvi Agarwal","Aanya Sharma","Myra Singh","Aarohi Patel","Anika Reddy","Navya Gupta","Siya Verma","Pari Mishra","Riya Khan","Anvi Jain","Ira Shah","Sia Tiwari","Kiara Dubey","Amaira Joshi","Liam Smith","Olivia Johnson","Noah Williams","Emma Brown","Oliver Jones","Ava Garcia","Elijah Miller","Charlotte Davis","William Rodriguez","Sophia Martinez","James Hernandez","Amelia Lopez","Benjamin Gonzalez","Mia Wilson","Lucas Anderson","Isabella Taylor","Henry Thomas","Evelyn Moore","Alexander Jackson","Harper Martin","Sebastian Lee","Camila Perez","Jack Thompson","Abigail White","Owen Harris","Emily Sanchez","Theodore Clark","Ella Lewis","Samuel Robinson","Avery Walker","Daniel Young","Sofia Allen","Matthew King","Aria Wright","Joseph Scott","Luna Green","David Baker","Chloe Adams","Leo Nelson","Grace Carter","Ryan Mitchell","Riley Perez","Luke Roberts","Zoey Turner","John Phillips"];

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await module.exports.down(queryInterface, Sequelize);

    const now = new Date();
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("password123", salt);

    // -- 1. CORE DATA --
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

    const departmentData = [
      { id: 1, name: "CSE" },
      { id: 2, name: "ECE" },
      { id: 3, name: "EEE" },
      { id: 4, name: "MECH" },
      { id: 5, name: "CSM" },
      { id: 6, name: "CSD" },
      { id: 7, name: "Administration" },
      { id: 8, name: "General" },
    ].map((d) => ({ ...d, created_at: now, updated_at: now }));
    await queryInterface.bulkInsert("departments", departmentData);
    const departmentMap = departmentData.reduce(
      (acc, d) => ({ ...acc, [d.name]: d.id }),
      {}
    );

    const coursesData = [
      // CSE
      {
        name: "Data Structures",
        code: "CS201",
        department_id: departmentMap.CSE,
      },
      { name: "Algorithms", code: "CS202", department_id: departmentMap.CSE },
      {
        name: "Operating Systems",
        code: "CS301",
        department_id: departmentMap.CSE,
      },
      {
        name: "Database Management",
        code: "CS302",
        department_id: departmentMap.CSE,
      },
      {
        name: "Computer Networks",
        code: "CS401",
        department_id: departmentMap.CSE,
      },
      {
        name: "Software Engineering",
        code: "CS402",
        department_id: departmentMap.CSE,
      },
      // ECE
      {
        name: "Analog Circuits",
        code: "EC201",
        department_id: departmentMap.ECE,
      },
      {
        name: "Digital Logic Design",
        code: "EC202",
        department_id: departmentMap.ECE,
      },
      {
        name: "Signals and Systems",
        code: "EC301",
        department_id: departmentMap.ECE,
      },
      {
        name: "Microprocessors",
        code: "EC302",
        department_id: departmentMap.ECE,
      },
      { name: "VLSI Design", code: "EC401", department_id: departmentMap.ECE },
      {
        name: "Communication Systems",
        code: "EC402",
        department_id: departmentMap.ECE,
      },
      // EEE
      {
        name: "Electrical Machines",
        code: "EE201",
        department_id: departmentMap.EEE,
      },
      {
        name: "Power Electronics",
        code: "EE202",
        department_id: departmentMap.EEE,
      },
      {
        name: "Control Systems",
        code: "EE301",
        department_id: departmentMap.EEE,
      },
      {
        name: "Power Systems Analysis",
        code: "EE302",
        department_id: departmentMap.EEE,
      },
      {
        name: "High Voltage Engineering",
        code: "EE401",
        department_id: departmentMap.EEE,
      },
      {
        name: "Renewable Energy",
        code: "EE402",
        department_id: departmentMap.EEE,
      },
      // MECH
      {
        name: "Thermodynamics",
        code: "ME201",
        department_id: departmentMap.MECH,
      },
      {
        name: "Fluid Mechanics",
        code: "ME202",
        department_id: departmentMap.MECH,
      },
      {
        name: "Strength of Materials",
        code: "ME301",
        department_id: departmentMap.MECH,
      },
      {
        name: "Machine Design",
        code: "ME302",
        department_id: departmentMap.MECH,
      },
      {
        name: "Heat Transfer",
        code: "ME401",
        department_id: departmentMap.MECH,
      },
      { name: "Robotics", code: "ME402", department_id: departmentMap.MECH },
      // CSM (AI & ML)
      { name: "Intro to AI", code: "AI201", department_id: departmentMap.CSM },
      {
        name: "Machine Learning",
        code: "AI202",
        department_id: departmentMap.CSM,
      },
      {
        name: "Deep Learning",
        code: "AI301",
        department_id: departmentMap.CSM,
      },
      {
        name: "Natural Language Processing",
        code: "AI302",
        department_id: departmentMap.CSM,
      },
      {
        name: "Computer Vision",
        code: "AI401",
        department_id: departmentMap.CSM,
      },
      {
        name: "Reinforcement Learning",
        code: "AI402",
        department_id: departmentMap.CSM,
      },
      // CSD (Data Science)
      {
        name: "Python for Data Science",
        code: "DS201",
        department_id: departmentMap.CSD,
      },
      {
        name: "Data Visualization",
        code: "DS202",
        department_id: departmentMap.CSD,
      },
      {
        name: "Big Data Analytics",
        code: "DS301",
        department_id: departmentMap.CSD,
      },
      {
        name: "Statistical Methods",
        code: "DS302",
        department_id: departmentMap.CSD,
      },
      {
        name: "Data Warehousing",
        code: "DS401",
        department_id: departmentMap.CSD,
      },
      {
        name: "Business Intelligence",
        code: "DS402",
        department_id: departmentMap.CSD,
      },
    ].map((c) => ({ ...c, created_at: now, updated_at: now }));
    await queryInterface.bulkInsert("courses", coursesData);
    const courses = await queryInterface.sequelize.query(
      `SELECT id, name, department_id FROM courses;`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    // -- 2. USERS, PROFILES, CLASSES --
    const users = [];
    const facultyProfiles = [];
    const studentProfiles = [];
    const userRoles = [];
    const classes = [];
    const facultyMapByDept = {};
    let userIdCounter = 1;
    let classIdCounter = 1;
    let nameIndex = 0;

    // Static Users
    users.push(
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
      }
    );
    facultyProfiles.push(
      {
        user_id: 1001,
        department_id: departmentMap.General,
        designation: "Faculty",
        created_at: now,
        updated_at: now,
      },
      {
        user_id: 1002,
        department_id: departmentMap.Administration,
        designation: "Principal",
        created_at: now,
        updated_at: now,
      },
      {
        user_id: 1,
        department_id: departmentMap.Administration,
        designation: "Principal",
        created_at: now,
        updated_at: now,
      },
      {
        user_id: 2,
        department_id: departmentMap.Administration,
        designation: "Administrator",
        created_at: now,
        updated_at: now,
      }
    );
    userRoles.push(
      ...[1001, 1002].flatMap((id) =>
        [1, 2, 3, 4, 5].map((r) => ({
          user_id: id,
          role_id: r,
          created_at: now,
          updated_at: now,
        }))
      ),
      { user_id: 1, role_id: 2, created_at: now, updated_at: now },
      { user_id: 2, role_id: 1, created_at: now, updated_at: now }
    );
    userIdCounter = 1003;

    // Generate HODs, Faculty, Incharges, Classes, and Students
    for (const dept of departmentData.filter(
      (d) => d.name !== "Administration" && d.name !== "General"
    )) {
      const hodId = userIdCounter++;
      users.push({
        id: hodId,
        name: `Dr. ${dept.name} HOD`,
        email: `hod.${dept.name.toLowerCase()}@test.com`,
        password: hashedPassword,
        created_at: now,
        updated_at: now,
      });
      facultyProfiles.push({
        user_id: hodId,
        department_id: dept.id,
        designation: "HOD",
        created_at: now,
        updated_at: now,
      });
      userRoles.push(
        { user_id: hodId, role_id: 3, created_at: now, updated_at: now },
        { user_id: hodId, role_id: 5, created_at: now, updated_at: now }
      );

      facultyMapByDept[dept.id] = [hodId];
      for (let i = 1; i <= 4; i++) {
        const facultyId = userIdCounter++;
        users.push({
          id: facultyId,
          name: `Prof. ${dept.name} Faculty ${i}`,
          email: `faculty.${dept.name.toLowerCase()}${i}@test.com`,
          password: hashedPassword,
          created_at: now,
          updated_at: now,
        });
        facultyProfiles.push({
          user_id: facultyId,
          department_id: dept.id,
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
        facultyMapByDept[dept.id].push(facultyId);
      }

      for (let i = 1; i <= 2; i++) {
        // 2 Classes per department
        const inchargeId = userIdCounter++;
        const className = `${dept.name} Section ${String.fromCharCode(64 + i)}`;
        users.push({
          id: inchargeId,
          name: `Prof. ${className} Incharge`,
          email: `incharge.${dept.name.toLowerCase()}${i}@test.com`,
          password: hashedPassword,
          created_at: now,
          updated_at: now,
        });
        facultyProfiles.push({
          user_id: inchargeId,
          department_id: dept.id,
          designation: "Incharge",
          created_at: now,
          updated_at: now,
        });
        userRoles.push(
          { user_id: inchargeId, role_id: 4, created_at: now, updated_at: now },
          { user_id: inchargeId, role_id: 5, created_at: now, updated_at: now }
        );

        const classId = classIdCounter++;
        classes.push({
          id: classId,
          name: className,
          department_id: dept.id,
          year: 2025,
          incharge_id: inchargeId,
          created_at: now,
          updated_at: now,
        });

        for (let j = 1; j <= 15; j++) {
          // 15 students per class
          const studentId = userIdCounter++;
          const studentName = studentNames[nameIndex++ % studentNames.length];
          const rollNumber = `${dept.name}${25 - 23}0${classId}${String(
            j
          ).padStart(2, "0")}`;
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
            class_id: classId,
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
      }
    }

    await queryInterface.bulkInsert("users", users);
    await queryInterface.bulkInsert("faculty_profiles", facultyProfiles);
    await queryInterface.bulkInsert("classes", classes);
    await queryInterface.bulkInsert("student_profiles", studentProfiles);
    await queryInterface.bulkInsert("user_roles", userRoles);

    // -- 3. TIMETABLES --
    const timetables = [];
    const timeSlots = [
      ["09:00", "10:00"],
      ["10:00", "11:00"],
      ["11:00", "12:00"],
      ["13:00", "14:00"],
      ["14:00", "15:00"],
      ["15:00", "16:00"],
    ];
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

    for (const cls of classes) {
      const deptCourses = courses.filter(
        (c) => c.department_id === cls.department_id
      );
      const facultyPool = facultyMapByDept[cls.department_id];
      let courseIndex = 0;

      for (let i = 0; i < 6; i++) {
        // 6 courses per class
        const course = deptCourses[courseIndex % deptCourses.length];
        const day = days[i % days.length];
        const slot = timeSlots[i % timeSlots.length];

        timetables.push({
          course_id: course.id,
          class_id: cls.id,
          faculty_id: facultyPool[i % facultyPool.length],
          semester: 1,
          day_of_week: day,
          start_time: slot[0],
          end_time: slot[1],
          created_at: now,
          updated_at: now,
        });
        courseIndex++;
      }
    }
    await queryInterface.bulkInsert("timetables", timetables);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("attendances", null, {});
    await queryInterface.bulkDelete("timetables", null, {});
    await queryInterface.bulkDelete("user_roles", null, {});
    await queryInterface.bulkDelete("student_profiles", null, {});
    await queryInterface.bulkDelete("faculty_profiles", null, {});
    await queryInterface.bulkDelete("courses", null, {});
    await queryInterface.bulkDelete("classes", null, {});
    await queryInterface.bulkDelete("users", null, {});
    await queryInterface.bulkDelete("roles", null, {});
    await queryInterface.bulkDelete("departments", null, {});
  },
};
