"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("Bills", [
      {
        NumberBill: 41,
        NameBill: "Kho sach mua nam 2021",
        DateGenerateBill: new Date(),
      },
      {
        NumberBill: 42,
        NameBill: "Kho sach mua nam 2022",
        DateGenerateBill: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("Bills", null, {});
  },
};
