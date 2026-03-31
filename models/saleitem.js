


'use strict'
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class SaleItem extends Model {
    static associate(models) {
    
    }
  }

  SaleItem.init(
    {
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        unique: true
      },
      sale_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      product_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      unit_id: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      product_name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      quantity: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
      },
      unit_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
      },
      tax_percent: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        defaultValue: 0
      },
      tax_amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0
      },
      discount_percent: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        defaultValue: 0
      },
      discount_amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0
      },
      subtotal: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
      },
      total: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
      },
      deletedAt: {
        type: DataTypes.DATE,
        allowNull: true
      }
    },
    {
      sequelize,
      modelName: 'SaleItem',
      tableName: 'sale_items',
      timestamps: true,
      paranoid: true
    }
  )

  return SaleItem
}