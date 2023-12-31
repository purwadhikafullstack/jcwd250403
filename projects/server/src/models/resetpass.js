'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ResetPass extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ResetPass.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user',
      });
    }
  }
  ResetPass.init(
    {
      userId: DataTypes.INTEGER,
      token: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'ResetPass',
    }
  );
  return ResetPass;
};
