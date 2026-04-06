'use strict'
const { Model, DataTypes } = require('sequelize')
const { v4: uuidv4 } = require('uuid')

module.exports = (sequelize) => {
  class Supplier extends Model {
    static associate(models) {
     
    }
  }

  Supplier.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      supplierName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: 'Supplier name is required' }
        }
      },

      email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isEmail: { msg: 'Invalid email format' },
          notEmpty: { msg: 'Email cannot be empty' },
          len: {
            args: [5, 100],
            msg: 'Email must be between 5 and 100 characters'
          }
        }
      },
      image: {
        type: DataTypes.STRING,
        allowNull: true
      },

      phone: DataTypes.STRING,
      mobile: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          is: {
            args: /^[0-9]+$/i,
            msg: 'Mobile must contain only numbers'
          },
          len: {
            args: [7, 15],
            msg: 'Mobile must be between 7 - 15 digits'
          }
        }
      },

      address: DataTypes.TEXT,

      country: DataTypes.STRING,
      countryCode: DataTypes.STRING,
      dialCode: DataTypes.STRING,

      city: DataTypes.STRING,
      state: DataTypes.STRING,
      zipCode: DataTypes.STRING,

      currency: {
        type: DataTypes.STRING,
        defaultValue: 'USD'
      },

      taxId: DataTypes.STRING,
      paymentTerms: DataTypes.STRING,

      status: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
      },

      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },

      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        unique: true
      },

      deletedAt: {
        type: DataTypes.DATE
      }
    },
    {
      sequelize,
      modelName: 'Supplier',
      tableName: 'suppliers',

      timestamps: true, // createdAt, updatedAt
      paranoid: true // soft deletes using deletedAt
    }
  )

  return Supplier
}
