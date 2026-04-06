'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ProductUnit extends Model {
    static associate(models) {
      
    }
  }

  ProductUnit.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
      },

      product_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },

      unit_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },

      base_unit_id: {
        type: DataTypes.INTEGER,
        allowNull: true
      },

      // Example: Box => 12 Piece
      conversion_value: {
        type: DataTypes.FLOAT,
        allowNull: false,
        comment: "How many base units"
      },

      // Selling price for this unit
      selling_price: {
        type: DataTypes.FLOAT,
        allowNull: false
      },

      // Purchase cost for this unit (optional)
      purchase_price: {
        type: DataTypes.FLOAT,
        allowNull: true
      },

      // Optional barcode per unit
      barcode: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true
      },

      // Optional SKU for this unit
      sku: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true
      },

      // If you want custom sorting in UI
      sortOrder: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      },

      deletedAt: {
        allowNull: true,
        type: DataTypes.DATE
      }
    },
    {
      sequelize,
      modelName: 'ProductUnit',
      tableName: 'ProductUnits',
      timestamps: true,
      paranoid: true
    }
  );

  return ProductUnit;
};
