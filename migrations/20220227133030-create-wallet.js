"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("wallets", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      userId: {
        type: Sequelize.UUID,
        allowNull: false,
        reference: {
          model: "users",
          key: "id",
        },
        onDelete: "CASCADE",
        onUpate: "CASCADE",
      },
      walletNumber: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      balance: {
        type: Sequelize.DOUBLE,
        allowNull: false,
        defaultValue: 0.0,
      },
      amountSpent: {
        type: Sequelize.DOUBLE,
        allowNull: false,
        defaultValue: 0.0,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("wallets");
  },
};
