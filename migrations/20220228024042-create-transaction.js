"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("transactions", {
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
      walletId: {
        type: Sequelize.UUID,
        allowNull: false,
        reference: {
          model: "wallets",
          key: "walletNumber",
        },
        onDelete: "CASCADE",
        onUpate: "CASCADE",
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      amount: {
        type: Sequelize.DOUBLE,
        allowNull: false,
      },
      type: {
        type: Sequelize.ENUM("credit", "debit"),
        defaultValue: "debit",
        allowNull: false,
      },
      narration: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      merchant: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      category: {
        type: Sequelize.STRING,
        allowNull: true,
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
    await queryInterface.dropTable("transactions");
  },
};
