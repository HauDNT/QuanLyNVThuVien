'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('BillTypes', [
      {
        Name: 'Mua',
      },
      {
        Name: 'Tang',
      },
    ]);
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('BillTypes', null, {});
  }
};
