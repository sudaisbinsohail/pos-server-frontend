'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Company extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
    }
  }
  Company.init(
    {
       name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: 'Company name is required'
          },
          len: {
            args: [2, 100],
            msg: 'Company name must be at least 2 characters'
          },
          is: {
            args: /^[A-Za-z][A-Za-z\s&.-]+$/,
            msg: 'Company name must contain only letters'
          }
        }
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: 'Company address is required'
          },
          len: {
            args: [5, 255],
            msg: 'Address is too short'
          },
         
        }
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: 'Company phone is required'
          },
          is: {
            args: /^[0-9+()-\s]{7,15}$/,
            msg: 'Invalid phone number'
          }
        }
      },
      country: DataTypes.STRING,
      image: DataTypes.STRING,
      currency: {
              type: DataTypes.STRING,
              defaultValue: 'USD'
            },


    },
    {
      sequelize,
      modelName: 'Company'
    }
  )
  return Company
}
