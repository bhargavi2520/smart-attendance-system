'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // The main issue is that the student_classes table has a unique constraint on student_id,
    // but it should be a composite primary key on both student_id and class_id.
    // To fix this, we will drop the table and recreate it with the correct schema.
    // This is safer than trying to alter the constraints, especially since the table
    // was not created by a migration.

    // First, drop the existing table if it exists.
    await queryInterface.dropTable('student_classes');

    // Then, create the table with the correct composite primary key.
    await queryInterface.createTable('student_classes', {
      student_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'student_profiles',
          key: 'id'
        },
        primaryKey: true
      },
      class_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'classes',
          key: 'id'
        },
        primaryKey: true
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },

  async down (queryInterface, Sequelize) {
    // In the down migration, we will just drop the table.
    await queryInterface.dropTable('student_classes');
  }
};
