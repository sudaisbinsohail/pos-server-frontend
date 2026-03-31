'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('ProductUnits', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      uuid: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        unique: true
      },
      product_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: { model: 'Products', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      unit_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Units', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      base_unit_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'Units', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      conversion_value: {
        type: Sequelize.FLOAT,
        allowNull: false
      },
      selling_price: {
        type: Sequelize.FLOAT,
        allowNull: false
      },
      purchase_price: {
        type: Sequelize.FLOAT,
        allowNull: true
      },
      barcode: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true
      },
      sku: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true
      },
      is_default: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      sortOrder: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
      deletedAt: { type: Sequelize.DATE, allowNull: true }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('ProductUnits');
  }
};
