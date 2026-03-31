'use strict'
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class Permission extends Model {
    static associate(models) {
      
    }
  }

  Permission.init(
    {
      id: {
        type: DataTypes.INTEGER,
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
        allowNull: false,
        unique: true,
        comment: 'Unique permission identifier (e.g., products.view, sales.create)'
      },
      display_name: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: 'Human-readable permission name'
      },
      module: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: 'Module/resource this permission belongs to (products, sales, users, etc.)'
      },
      action: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: 'Action type (view, create, edit, delete, manage)'
      },
      description: {
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
      modelName: 'Permission',
      tableName: 'permissions',
      timestamps: true,
      paranoid: true
    }
  )

  return Permission
}