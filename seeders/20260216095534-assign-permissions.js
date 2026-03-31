'use strict';

const { Role, Permission } = require('../models'); // adjust path
module.exports = {
  async up() {
    try {
      // 1. Find admin role
      const adminRole = await Role.findOne({ where: { name: 'admin' } });
      if (!adminRole) throw new Error('Admin role not found.');

      // 2. Get all permissions
      const permissions = await Permission.findAll();
      if (permissions.length === 0) {
        console.log('No permissions found to assign.');
        return;
      }

      // 3. Use setPermissions to assign all permissions
      await adminRole.setPermissions(permissions);

      console.log(`✅ Assigned ${permissions.length} permissions to admin role`);
    } catch (err) {
      console.error('❌ Error assigning permissions:', err);
      throw err;
    }
  },

  async down() {
    try {
      const adminRole = await Role.findOne({ where: { name: 'admin' } });
      if (adminRole) {
        await adminRole.setPermissions([]); // removes all permissions
        console.log('✅ Removed all permissions from admin role');
      }
    } catch (err) {
      console.error('❌ Error removing permissions:', err);
      throw err;
    }
  }
};
