"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("cards", {
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
      type: {
        type: Sequelize.ENUM(
          "lifestyle pro",
          "lifestyle premium",
          "lifestyle business"
        ),
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM("pending", "approved"),
        defaultValue: "pending",
        allowNull: false,
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
    await queryInterface.dropTable("cards");
  },
};
