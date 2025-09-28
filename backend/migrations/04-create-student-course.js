"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  // The 'up' migration runs when you deploy
  async up(queryInterface, Sequelize) {
    // 1. Create the table
    await queryInterface.createTable("StudentCourses", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      studentId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Users", // This MUST match the table name for users
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      courseId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Courses", // This MUST match the table name for courses
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });

    // 2. Add the unique constraint to prevent duplicates
    await queryInterface.addConstraint("StudentCourses", {
      fields: ["studentId", "courseId"],
      type: "unique",
      name: "student_course_unique_constraint",
    });
  },

  // The 'down' migration runs when you revert/undo
  async down(queryInterface, Sequelize) {
    // It must reverse the 'up' function, in reverse order
    await queryInterface.removeConstraint(
      "StudentCourses",
      "student_course_unique_constraint"
    );
    await queryInterface.dropTable("StudentCourses");
  },
};
