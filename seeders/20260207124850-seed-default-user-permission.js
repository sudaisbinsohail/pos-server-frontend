// 'use strict';

// const { Permission } = require('../models'); // adjust path if needed
// const { v4: uuidv4 } = require('uuid');

// module.exports = {
//   async up() {
//     try {

// const defaultPermissions = [
//   // Sales Tabs
//   {  id: uuidv4(),name: 'tab.pos', display_name: 'Access POS', module: 'sales', description: 'Access POS screen' },
//   {  id: uuidv4(),name: 'tab.customer', display_name: 'Access Customer', module: 'sales', description: 'Access Customer Management' },
//   {  id: uuidv4(),name: 'tab.sale_history', display_name: 'Access Sale History', module: 'sales', description: 'Access Sale History' },

//   // Inventory Tabs
//   {  id: uuidv4(),name: 'tab.products', display_name: 'Access Products', module: 'inventory', description: 'Access Products Page' },
//   {  id: uuidv4(),name: 'tab.category', display_name: 'Access Category', module: 'inventory', description: 'Access Category Page' },
//   {  id: uuidv4(),name: 'tab.brand', display_name: 'Access Brand', module: 'inventory', description: 'Access Brand Page' },
//   {  id: uuidv4(),name: 'tab.unit', display_name: 'Access Unit', module: 'inventory', description: 'Access Unit Page' },

//   // Purchasing Tabs
//   {  id: uuidv4(),name: 'tab.supplier', display_name: 'Access Supplier', module: 'purchasing', description: 'Access Supplier Page' },

//   // Settings Tabs
//   {  id: uuidv4(),name: 'tab.users', display_name: 'Access Users', module: 'settings', description: 'Access Users Page' },
//   {  id: uuidv4(),name: 'tab.company', display_name: 'Access Company', module: 'settings', description: 'Access Company Settings' },
//   {  id: uuidv4(),name: 'tab.roles', display_name: 'Access Roles & Permissions', module: 'settings', description: 'Access Roles & Permissions Page' },
// ]


//       const createdPermissions = [];

//       for (const perm of defaultPermissions) {
//         const [permission, isCreated] = await Permission.findOrCreate({
//           where: { name: perm.name },
//           defaults: perm
//         });

//         if (isCreated) createdPermissions.push(permission);
//       }

//       console.log(`✅ Seeded ${createdPermissions.length} permissions`);
//     } catch (err) {
//       console.error('❌ Seed permissions error:', err);
//     }
//   },

//   async down() {
//     try {
//       const permissionNames = [
//         'view_products','create_products','edit_products','delete_products','manage_products',
//         'view_sales','create_sales','delete_sales','manage_sales',
//         'view_customers','create_customers','edit_customers','delete_customers',
//         'view_suppliers','create_suppliers','edit_suppliers','delete_suppliers',
//         'view_categories','create_categories','edit_categories','delete_categories',
//         'view_brands','create_brands','edit_brands','delete_brands',
//         'view_units','create_units','edit_units','delete_units',
//         'view_users','create_users','edit_users','delete_users','manage_users',
//         'view_roles','create_roles','edit_roles','delete_roles','assign_permissions',
//         'view_settings','edit_settings','manage_company',
//         'view_reports','export_reports'
//       ];

//       await Permission.destroy({ where: { name: permissionNames } });
//       console.log('✅ Deleted seeded permissions');
//     } catch (err) {
//       console.error('❌ Delete permissions error:', err);
//     }
//   }
// };
