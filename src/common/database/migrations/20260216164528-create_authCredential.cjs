'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('auth_credentials', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4
      },

      userId: {
        type: Sequelize.UUID,
        allowNull: false,
        unique: true
      },

      type: {
        type: Sequelize.ENUM('PASSWORD','BIOMETRIC'),
        allowNull: false,
        defaultValue: 'PASSWORD'
      },

      secretHash: {
        type: Sequelize.STRING,
        allowNull: false
      },

      failedAttempts: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },

      lockedUntil: {
        type: Sequelize.DATE,
        allowNull: true
      },

      lastLogin: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
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
   await queryInterface.dropTable('auth_credentials');
  }
};
