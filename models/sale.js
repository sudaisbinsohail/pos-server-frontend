
'use strict'
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class Sale extends Model {
    static associate(models) {
  
    }
  }

  Sale.init(
    {
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        unique: true
      },
      invoice_number: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      customer_id: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      sale_date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      },
      subtotal: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0
      },
      tax_amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0
      },
      discount_amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0
      },
      total_amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
      },
      paid_amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0
      },
      change_amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0
      },
      payment_method: {
        type: DataTypes.ENUM('cash', 'card', 'mobile', 'bank_transfer'),
        allowNull: false,
        defaultValue: 'cash'
      },
      payment_status: {
        type: DataTypes.ENUM('paid', 'partial', 'unpaid'),
        allowNull: false,
        defaultValue: 'unpaid'
      },
      sale_status: {
        type: DataTypes.ENUM('completed', 'pending', 'cancelled'),
        allowNull: false,
        defaultValue: 'completed'
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      deletedAt: {
        type: DataTypes.DATE,
        allowNull: true
      }
    },
    {
      sequelize,
      modelName: 'Sale',
      tableName: 'sales',
      timestamps: true,
      paranoid: true
    }
  )

  return Sale
}