'use strict'
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class Unit extends Model {
    static associate(models) {
      
    }
  }

  Unit.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      unit_name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      base_unit_id: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      universal_conversion: {
        type: DataTypes.FLOAT,
        allowNull: true
      },
      abbreviation: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      notes: {
        type: DataTypes.STRING,
        allowNull: true
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      created_by: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'system'
      },
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
      modelName: 'Unit',
      tableName: 'Units',
      timestamps: true,
      paranoid: true
    }
  )

  return Unit
}
