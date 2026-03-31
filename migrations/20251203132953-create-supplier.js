'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Suppliers', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },

      supplierName: {
        type: Sequelize.STRING,
        allowNull: false
      },

      email: Sequelize.STRING,
      phone: Sequelize.STRING,
      mobile: Sequelize.STRING,
      address: Sequelize.TEXT,

      country: Sequelize.STRING,
      countryCode: Sequelize.STRING,
      dialCode: Sequelize.STRING,
      city: Sequelize.STRING,
      state: Sequelize.STRING,
      zipCode: Sequelize.STRING,
      image: {
        type: Sequelize.STRING,
        allowNull: true
      },
      currency: {
        type: Sequelize.STRING,
        defaultValue: 'USD'
      },

      taxId: Sequelize.STRING,
      paymentTerms: Sequelize.STRING,

      status: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },

      user_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },

      uuid: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        unique: true
      },

      deletedAt: Sequelize.DATE,

      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },

      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    })
  },

  async down(queryInterface) {
    await queryInterface.dropTable('Suppliers')
  }
}
