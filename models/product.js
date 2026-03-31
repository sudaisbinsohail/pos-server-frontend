'use strict'
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    static associate(models) {
    }
  }

  Product.init(
    {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
      },

      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        unique: true
      },

      name: {
        type: DataTypes.STRING,
        allowNull: false
      },

      sku: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true
      },

      category_id: {
        type: DataTypes.INTEGER,
        allowNull: true
      },

      brand_id: {
        type: DataTypes.INTEGER,
        allowNull: true
      },

      base_unit_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      image: DataTypes.STRING,

      buying_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
      },

      cost_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true
      },

      selling_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
      },

      tax_percent: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        defaultValue: 0
      },

      min_stock_level: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
      },

      opening_stock: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        defaultValue: 0
      },

      barcode: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true
      },

      description: {
        type: DataTypes.TEXT,
        allowNull: true
      },

      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },

      status: {
        type: DataTypes.ENUM('active', 'inactive'),
        allowNull: false,
        defaultValue: 'active'
      },

      deletedAt: {
        type: DataTypes.DATE,
        allowNull: true
      }
    },
    {
      sequelize,
      modelName: 'Product',
      tableName: 'Products',
      timestamps: true,
      paranoid: true,
    }
  )

  return Product
}
