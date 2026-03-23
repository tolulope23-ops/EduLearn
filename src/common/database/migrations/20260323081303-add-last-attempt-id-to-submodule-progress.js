'use strict';

export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('submodule_progress', 'lastAttemptId', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('submodule_progress', 'lastAttemptId');
  }
};