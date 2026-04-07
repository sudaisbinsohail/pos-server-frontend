'use strict'
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class Store extends Model {
    static associate(models) {
      // defined in associations.js
    }
  }

  Store.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey:true,
        unique: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: 'Store name is required' },
          len: { args: [2, 100], msg: 'Store name must be between 2 and 100 characters' }
        }
      },
      code: {
        // Short unique identifier e.g. "STR-01"
        type: DataTypes.STRING,
        allowNull: true,
        unique: true
      },
      address: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: true
      },
      email: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: { isEmail: { msg: 'Invalid email address' } }
      },
      city: {
        type: DataTypes.STRING,
        allowNull: true
      },
      state: {
        type: DataTypes.STRING,
        allowNull: true
      },
      country: {
        type: DataTypes.STRING,
        allowNull: true
      },
      is_main: {
        // Marks the headquarters / main branch
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
      },
      // Which company this store belongs to
      company_id: {
        type: DataTypes.UUID,
        allowNull: false
      },
      // User who created this store
      user_id: {
        type: DataTypes.UUID,
        allowNull: false
      },
      deletedAt: {
        type: DataTypes.DATE,
        allowNull: true
      }
    },
    {
      sequelize,
      modelName: 'Store',
      tableName: 'stores',
      timestamps: true,
      paranoid: true
    }
  )

  return Store
}