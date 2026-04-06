// 'use strict'
// const { Model } = require('sequelize')
// module.exports = (sequelize, DataTypes) => {
//   class Category extends Model {
//     /**
//      * Helper method for defining associations.
//      * This method is not a part of Sequelize lifecycle.
//      * The `models/index` file will call this method automatically.
//      */
//     static associate(models) {
  
//     }
//   }
//   Category.init(
//     {
//       categoryName: DataTypes.STRING,
//       id: {
//         type: DataTypes.UUID,
//         defaultValue: DataTypes.UUIDV4,
//         primaryKey: true,
//         allowNull: false
//       },
//       slug: DataTypes.STRING,
//       parentId: DataTypes.INTEGER,
//       image: DataTypes.STRING,
//       status: DataTypes.BOOLEAN,
//       user_id: {
//         type: DataTypes.INTEGER,
//         allowNull: true,
//         references: {
//           model: 'Users',
//           key: 'id'
//         },
//         onUpdate: 'CASCADE',
//         onDelete: 'SET NULL'
//       },
//       sortOrder: DataTypes.INTEGER,
//       deletedAt: {
//         type: DataTypes.DATE,
//         allowNull: true
//       }
//     },
//     {
//       sequelize,
//       modelName: 'Category',
//       timestamps: true,
//       paranoid: true
//     }
//   )
//   return Category
// }
'use strict'
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    static associate(models) {}
  }

  Category.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      categoryName: {
        type: DataTypes.STRING,
        allowNull: false
      },
      slug: {
        type: DataTypes.STRING,
        allowNull: true
      },
      parentId: {
        type: DataTypes.UUID,
        allowNull: true
      },
      image: {
        type: DataTypes.STRING,
        allowNull: true
      },
      status: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
      },
      user_id: {
        type: DataTypes.UUID,
        allowNull: false
      },
      sortOrder: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      }
    },
    {
      sequelize,
      modelName: 'Category',
      tableName: 'categories',
      timestamps: true,
      paranoid: true
    }
  )

  return Category
}