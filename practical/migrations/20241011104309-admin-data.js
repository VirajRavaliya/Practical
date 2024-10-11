"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("user", [
      {
        userName: "admin",
        password:
          "$2a$10$a4xDes1RqZeUaJCZokRMs.uGv2YJjHkdvKKOCtlWTRxNq5fwMguw6",
        role: "admin",
        email: "admin@mailinator.com",
        createdAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     */
  },
};
