"use strict";
const { Model } = require("sequelize");
const { hashPassword } = require("../helpers/bcrypt");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init(
    {
      email: {
        type: DataTypes.STRING,
        unique: {
          args: true,
          msg: "Email already exists",
        },
        validate: {
          isEmail: {
            args: true,
            msg: "Invalid email format",
          },
          notEmpty: {
            args: true,
            msg: "Email is required",
          },
          notNull: {
            args: true,
            msg: "Email is required",
          },
        },
      },
      password: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: {
            args: true,
            msg: "Password is required",
          },
          notNull: {
            args: true,
            msg: "Password is required",
          },
          len: {
            args: [6],
            msg: "Password minimum 6 characters",
          },
        },
      },
    },
    {
      hooks: {
        beforeCreate: (user, options) => {
          user.password = hashPassword(user.password);
        },
      },
      sequelize,
      modelName: "User",
    }
  );

  return User;
};
