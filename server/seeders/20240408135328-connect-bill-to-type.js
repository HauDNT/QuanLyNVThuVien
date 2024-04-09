'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('BillToType', [
      {
        BillId: 1,
        BillTypeId: 1,
      },
      {
        BillId: 2,
        BillTypeId: 1,
      }
    ]);
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('BillToType', null, {});
  }
};
