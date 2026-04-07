'use strict'
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class Terminal extends Model {
    static associate(models) {
      // defined in associations.js
    }
  }

  Terminal.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey:true,
        unique: true
      },
      name: {
        // Human-readable label e.g. "Counter 1", "POS-A"
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: 'Terminal name is required' },
          len: { args: [2, 100], msg: 'Terminal name must be between 2 and 100 characters' }
        }
      },
      terminal_code: {
        // Unique machine/device identifier
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      // The store/branch this terminal belongs to
      store_id: {
        type: DataTypes.UUID,
        allowNull: false
      },
      // Optionally track which user is currently assigned/logged into this terminal
      assigned_user_id: {
        type: DataTypes.UUID,
        allowNull: true
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
      },
      // Last time a sale was processed on this terminal
      last_activity_at: {
        type: DataTypes.DATE,
        allowNull: true
      },
      // User who created/registered this terminal
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
      modelName: 'Terminal',
      tableName: 'terminals',
      timestamps: true,
      paranoid: true
    }
  )

  return Terminal
}