'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('submodules', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },

      moduleId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'modules',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },

      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      type: {
        type: Sequelize.ENUM('document', 'video', 'quiz'),
        allowNull: false,
      },

      contentText: {
        type: Sequelize.TEXT,
        allowNull: true,
      },

      contentUrl: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      downloadable: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },

      contentSize: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },

      contentVersion: {
        type: Sequelize.INTEGER,
        defaultValue: 1,
      },

      sequenceNumber: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },

      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },

      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });

    // Composite unique index (prevents duplicate ordering inside a module)
    await queryInterface.addIndex(
      'submodules',
      ['moduleId', 'sequenceNumber'],
      {
        unique: true,
        name: 'submodules_unique_module_sequence',
      }
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('submodules');
  },
};