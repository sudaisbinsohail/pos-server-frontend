'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('sales', 'store_id', {
      type: Sequelize.UUID,
      allowNull: true,      // nullable so existing rows are not broken
      references: { model: 'stores', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
      after: 'user_id'      // SQLite ignores this; MySQL respects it
    })

    await queryInterface.addColumn('sales', 'terminal_id', {
      type: Sequelize.UUID,
      allowNull: true,
      references: { model: 'terminals', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
      after: 'store_id'
    })

    await queryInterface.addIndex('sales', ['store_id'],    { name: 'idx_sales_store_id' })
    await queryInterface.addIndex('sales', ['terminal_id'], { name: 'idx_sales_terminal_id' })
  },

  async down(queryInterface) {
    await queryInterface.removeIndex('sales', 'idx_sales_store_id')
    await queryInterface.removeIndex('sales', 'idx_sales_terminal_id')
    await queryInterface.removeColumn('sales', 'terminal_id')
    await queryInterface.removeColumn('sales', 'store_id')
  }
}