'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Brand extends Model {
    static associate(models) {
    }
  }

  Brand.init(
    {
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        unique: true
      },
      brandName: {
        type: DataTypes.STRING,
        allowNull: false
      },
      slug: {
        type: DataTypes.STRING,
        unique: true
      },
      image: {
        type: DataTypes.STRING,
        allowNull: true
      },
      status: {
        type: DataTypes.INTEGER,
        defaultValue: 1
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
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
      modelName: 'Brand',
      tableName: 'Brands',
      timestamps: true,
      paranoid: true
    }
  )

  return Brand
}
