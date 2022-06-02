'use strict';
const {
  Model, Sequelize
} = require('sequelize');

const bcrypt = require("bcryptjs");

module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Users.init({
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING(18),
      allowNull: false
    },
    isAdmin: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Users',
  });

  Users.addHook('beforeSave', async crypt => {
    return bcrypt.hash(crypt.password, 8)
      .then(hash => {
        crypt.password = hash;
      })
      .catch(err => {
        throw new Error();
      });
  });

  return Users;
};