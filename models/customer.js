
'use strict'
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class Customer extends Model {
    static associate(models) {
      // Customer belongs to User (who created it)
      // Customer.belongsTo(models.User, {
      //   foreignKey: 'user_id',
      //   as: 'creator'
      // })
    }
  }

  Customer.init(
    {
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        unique: true
      },
      customerName: {
        type: DataTypes.STRING,
        allowNull: false
      },
      email: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          isEmail: true
        }
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: true
      },
      mobile: {
        type: DataTypes.STRING,
        allowNull: false
      },
      address: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      country: {
        type: DataTypes.STRING,
        allowNull: true
      },
      countryCode: {
        type: DataTypes.STRING,
        allowNull: true
      },
      dialCode: {
        type: DataTypes.STRING,
        allowNull: true
      },
      city: {
        type: DataTypes.STRING,
        allowNull: true
      },
      state: {
        type: DataTypes.STRING,
        allowNull: true
      },
      zipCode: {
        type: DataTypes.STRING,
        allowNull: true
      },
      taxId: {
        type: DataTypes.STRING,
        allowNull: true
      },
      creditLimit: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        defaultValue: 0
      },
      balance: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        defaultValue: 0
      },
      image: {
        type: DataTypes.STRING,
        allowNull: true
      },
      status: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      deletedAt: {
        type: DataTypes.DATE,
        allowNull: true
      }
    },
    {
      sequelize,
      modelName: 'Customer',
      tableName: 'customers',
      timestamps: true,
      paranoid: true
    }
  )

  return Customer
}