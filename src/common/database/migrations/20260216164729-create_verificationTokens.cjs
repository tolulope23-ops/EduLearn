'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
        await queryInterface.createTable('verification_tokens', {
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
        type: Sequelize.ENUM('EMAIL_VERIFICATION','PASSWORD_RESET'),
        allowNull: false
      },

      tokenHash: {
        type: Sequelize.STRING,
        allowNull: false
      },

      expiresAt: {
        type: Sequelize.DATE,
        allowNull: false
      },

      usedAt: {
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
    await queryInterface.dropAllTables("verification_tokens");
  }
};
