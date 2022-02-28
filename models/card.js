"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class card extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      card.belongsTo(models.user);
      card.belongsTo(models.wallet);
    }
  }
  card.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      walletId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      type: {
        type: DataTypes.ENUM(
          "lifestyle pro",
          "lifestyle premium",
          "lifestyle business"
        ),
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM("pending", "approved"),
        defaultValue: "pending",
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "card",
    }
  );
  return card;
};
