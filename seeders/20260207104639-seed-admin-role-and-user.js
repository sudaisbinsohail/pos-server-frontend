const { v4: uuidv4 } = require('uuid');

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'roles',
      [
        {
          id: uuidv4(),
          
          name: 'admin',
          display_name: 'Admin',
          description: 'Administrator with full access',
          is_system_role: true,
          is_active: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('roles', { name: 'admin' }, {});
  }
};
