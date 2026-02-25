'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4
      },

      email: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: true
      },

      accountStatus: {
        type: Sequelize.ENUM('ACTIVE', 'PENDING', 'SUSPENDED', 'DELETED'),
        defaultValue: 'PENDING'
      },

      isEmailVerified: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },

      emailVerifiedAt: {
        type: Sequelize.DATE,
        allowNull: true
      },

      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },

      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('users');
  }
};
