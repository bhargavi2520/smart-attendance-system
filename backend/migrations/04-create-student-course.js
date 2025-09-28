"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  // The 'up' migration must accept BOTH queryInterface and Sequelize
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("StudentCourses", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER, // This works because Sequelize is now defined
      },
      studentId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      courseId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Courses",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });

    // This adds the unique constraint to prevent duplicates
    await queryInterface.addConstraint("StudentCourses", {
      fields: ["studentId", "courseId"],
      type: "unique",
      name: "student_course_unique_constraint",
    });
  },

  // The 'down' migration must also accept both
  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint(
      "StudentCourses",
      "student_course_unique_constraint"
    );
    await queryInterface.dropTable("StudentCourses");
  },
};
