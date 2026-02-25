'use strict';

const { v4: uuidv4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('permissions',[
      {
        id: uuidv4(),
        name: 'ACCESS ALL FEATURES',
        description: 'Allows user to access all features',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ],
      {}
    );
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('permissions', null, {});
  }
};
