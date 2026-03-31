'use strict'
const { Model } = require('sequelize')
const bcrypt = require('bcrypt')

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
    }
  }

  User.init(
    {
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        unique: true
      },

      company_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Companies',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
         validate: {
          notEmpty: {
            msg: 'Name is required'
          },
          len: {
            args: [2, 100],
            msg: 'Name must be at least 2 characters'
          },
          is: {
            args: /^[A-Za-z\s.'-]+$/,
            msg: 'Name must contain only letters'
          }
        }
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
       
         unique: {
          msg: 'Email already exists'
        },
        validate: {
          isEmail: {
            msg: 'Invalid email address'
          }
        },
        set(value) {
          this.setDataValue('email', value.toLowerCase())
        }
      },
      password_hash: {
        type: DataTypes.STRING,
        allowNull: false
      },
      // role: {
      //   type: DataTypes.ENUM('Admin', 'Manager', 'Cashier', 'User'),
      //   allowNull: false,
      //   defaultValue: 'User'
      // },



       role_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'roles',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
      },
      deletedAt: {
        type: DataTypes.DATE,
        allowNull: true
      }
    },
    {
      sequelize,
      modelName: 'User',
      tableName: 'Users',
      timestamps: true,
      paranoid: true
    }
  )

  User.beforeCreate(async (user, options) => {
    const salt = await bcrypt.genSalt(10)
    user.password_hash = await bcrypt.hash(user.password_hash, salt)
  })
  User.beforeUpdate(async (user, options) => {
    if (user.changed('password_hash')) {
      const salt = await bcrypt.genSalt(10)
      user.password_hash = await bcrypt.hash(user.password_hash, salt)
    }
  })

  return User
}
