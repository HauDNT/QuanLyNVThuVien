'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Users', [
      {
        Username: 'Thomas',
        Password: '123456',
        createdAt: new Date(),
        updatedAt: new Date(),
      }, {
        Username: 'Sadra',
        Password: '123456',
        createdAt: new Date(),
        updatedAt: new Date(),
      }, {
        Username: 'Clark',
        Password: '123456',
        createdAt: new Date(),
        updatedAt: new Date(),
      }, {
        Username: 'Heidy',
        Password: '123456',
        createdAt: new Date(),
        updatedAt: new Date(),
      }, {
        Username: 'Marry',
        Password: '123456',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Users', null, {});
  }
};
