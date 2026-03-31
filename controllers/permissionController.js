const db = require('../models')
const { Permission, Role } = db
const { Op } = require('sequelize')

module.exports = {
  /* =======================================================
   CREATE PERMISSION
  =========================================================*/
  async createPermission(data) {
    try {
      // Check if permission already exists
      const existingPermission = await Permission.findOne({
        where: {
          [Op.or]: [
            { name: data.name },
            { slug: data.slug }
          ]
        }
      })

      if (existingPermission) {
        return { success: false, error: 'Permission name or slug already exists' }
      }

      const permission = await Permission.create({
        name: data.name,
        slug: data.slug,
        module: data.module,
        action: data.action,
        description: data.description || null
      })

      return { success: true, permission }
    } catch (err) {
      console.error('Create permission error:', err)
      return { success: false, error: err.message }
    }
  },

  /* =======================================================
   UPDATE PERMISSION
  =========================================================*/
  async updatePermission(id, data) {
    try {
      const permission = await Permission.findByPk(id)

      if (!permission) {
        return { success: false, error: 'Permission not found' }
      }

      // Check for duplicate name/slug (excluding current permission)
      if (data.name || data.slug) {
        const existingPermission = await Permission.findOne({
          where: {
            [Op.or]: [
              data.name ? { name: data.name } : null,
              data.slug ? { slug: data.slug } : null
            ].filter(Boolean),
            id: { [Op.ne]: id }
          }
        })

        if (existingPermission) {
          return { success: false, error: 'Permission name or slug already exists' }
        }
      }

      await permission.update({
        name: data.name || permission.name,
        slug: data.slug || permission.slug,
        module: data.module || permission.module,
        action: data.action || permission.action,
        description: data.description !== undefined ? data.description : permission.description
      })

      return { success: true, permission }
    } catch (err) {
      console.error('Update permission error:', err)
      return { success: false, error: err.message }
    }
  },

  /* =======================================================
   DELETE PERMISSION
  =========================================================*/
  async deletePermission(id) {
    try {
      const permission = await Permission.findByPk(id, {
        include: [{ model: Role, as: 'roles' }]
      })

      if (!permission) {
        return { success: false, error: 'Permission not found' }
      }

      // Check if permission is assigned to any roles
      if (permission.roles && permission.roles.length > 0) {
        return {
          success: false,
          error: `Cannot delete permission. It is assigned to ${permission.roles.length} role(s)`
        }
      }

      await permission.destroy()
      return { success: true }
    } catch (err) {
      console.error('Delete permission error:', err)
      return { success: false, error: err.message }
    }
  },

  /* =======================================================
   GET PERMISSION BY ID
  =========================================================*/
  async getPermissionById(id) {
    try {
      const permission = await Permission.findByPk(id, {
        include: [{
          model: Role,
          as: 'roles',
          attributes: ['id', 'name']
        }]
      })

      if (!permission) {
        return { success: false, error: 'Permission not found' }
      }

      return { success: true, permission: permission.get({ plain: true }) }
    } catch (err) {
      console.error('Get permission error:', err)
      return { success: false, error: err.message }
    }
  },

  /* =======================================================
   GET ALL PERMISSIONS
  =========================================================*/
  async getPermissions(filters = {}) {
    try {
      const { search, module, action } = filters
      const where = {}

      if (search) {
        where[Op.or] = [
          { name: { [Op.like]: `%${search}%` } },
          { description: { [Op.like]: `%${search}%` } }
        ]
      }

      if (module) {
        where.module = module
      }

      if (action) {
        where.action = action
      }

      const permissions = await Permission.findAll({
        where,
        order: [
          ['module', 'ASC'],
          ['action', 'ASC'],
          ['name', 'ASC']
        ]
      })

      return { success: true, permissions: permissions.map(p => p.get({ plain: true })) }
    } catch (err) {
      console.error('Get permissions error:', err)
      return { success: false, error: err.message }
    }
  },

  /* =======================================================
   GET PERMISSIONS GROUPED BY MODULE
  =========================================================*/
  async getPermissionsGroupedByModule() {
    try {
      const permissions = await Permission.findAll({
        attributes: ['id', 'name',  'module', 'action', 'description'],
        order: [
          ['module', 'ASC'],
          ['action', 'ASC']
        ]
      })

      // Group permissions by module
      const grouped = {}
      permissions.forEach(permission => {
        const p = permission.get({ plain: true })
        if (!grouped[p.module]) {
          grouped[p.module] = []
        }
        grouped[p.module].push(p)
      })

      return { success: true, permissions: grouped }
    } catch (err) {
      console.error('Get grouped permissions error:', err)
      return { success: false, error: err.message }
    }
  },

  /* =======================================================
   SEED DEFAULT PERMISSIONS
  =========================================================*/
  async seedDefaultPermissions() {
    try {
      const defaultPermissions = [
        // Products Module
        { name: 'View Products', slug: 'view_products', module: 'products', action: 'read', description: 'View product list and details' },
        { name: 'Create Products', slug: 'create_products', module: 'products', action: 'create', description: 'Add new products' },
        { name: 'Edit Products', slug: 'edit_products', module: 'products', action: 'update', description: 'Modify existing products' },
        { name: 'Delete Products', slug: 'delete_products', module: 'products', action: 'delete', description: 'Remove products' },
        { name: 'Manage Products', slug: 'manage_products', module: 'products', action: 'manage', description: 'Full product management access' },

        // Sales Module
        { name: 'View Sales', slug: 'view_sales', module: 'sales', action: 'read', description: 'View sales history and reports' },
        { name: 'Create Sales', slug: 'create_sales', module: 'sales', action: 'create', description: 'Process new sales' },
        { name: 'Delete Sales', slug: 'delete_sales', module: 'sales', action: 'delete', description: 'Delete sales records' },
        { name: 'Manage Sales', slug: 'manage_sales', module: 'sales', action: 'manage', description: 'Full sales management access' },

        // Customers Module
        { name: 'View Customers', slug: 'view_customers', module: 'customers', action: 'read', description: 'View customer list' },
        { name: 'Create Customers', slug: 'create_customers', module: 'customers', action: 'create', description: 'Add new customers' },
        { name: 'Edit Customers', slug: 'edit_customers', module: 'customers', action: 'update', description: 'Modify customer information' },
        { name: 'Delete Customers', slug: 'delete_customers', module: 'customers', action: 'delete', description: 'Remove customers' },

        // Suppliers Module
        { name: 'View Suppliers', slug: 'view_suppliers', module: 'suppliers', action: 'read', description: 'View supplier list' },
        { name: 'Create Suppliers', slug: 'create_suppliers', module: 'suppliers', action: 'create', description: 'Add new suppliers' },
        { name: 'Edit Suppliers', slug: 'edit_suppliers', module: 'suppliers', action: 'update', description: 'Modify supplier information' },
        { name: 'Delete Suppliers', slug: 'delete_suppliers', module: 'suppliers', action: 'delete', description: 'Remove suppliers' },

        // Categories Module
        { name: 'View Categories', slug: 'view_categories', module: 'categories', action: 'read', description: 'View category list' },
        { name: 'Create Categories', slug: 'create_categories', module: 'categories', action: 'create', description: 'Add new categories' },
        { name: 'Edit Categories', slug: 'edit_categories', module: 'categories', action: 'update', description: 'Modify categories' },
        { name: 'Delete Categories', slug: 'delete_categories', module: 'categories', action: 'delete', description: 'Remove categories' },

        // Brands Module
        { name: 'View Brands', slug: 'view_brands', module: 'brands', action: 'read', description: 'View brand list' },
        { name: 'Create Brands', slug: 'create_brands', module: 'brands', action: 'create', description: 'Add new brands' },
        { name: 'Edit Brands', slug: 'edit_brands', module: 'brands', action: 'update', description: 'Modify brands' },
        { name: 'Delete Brands', slug: 'delete_brands', module: 'brands', action: 'delete', description: 'Remove brands' },

        // Units Module
        { name: 'View Units', slug: 'view_units', module: 'units', action: 'read', description: 'View unit list' },
        { name: 'Create Units', slug: 'create_units', module: 'units', action: 'create', description: 'Add new units' },
        { name: 'Edit Units', slug: 'edit_units', module: 'units', action: 'update', description: 'Modify units' },
        { name: 'Delete Units', slug: 'delete_units', module: 'units', action: 'delete', description: 'Remove units' },

        // Users Module
        { name: 'View Users', slug: 'view_users', module: 'users', action: 'read', description: 'View user list' },
        { name: 'Create Users', slug: 'create_users', module: 'users', action: 'create', description: 'Add new users' },
        { name: 'Edit Users', slug: 'edit_users', module: 'users', action: 'update', description: 'Modify user information' },
        { name: 'Delete Users', slug: 'delete_users', module: 'users', action: 'delete', description: 'Remove users' },
        { name: 'Manage Users', slug: 'manage_users', module: 'users', action: 'manage', description: 'Full user management access' },

        // Roles Module
        { name: 'View Roles', slug: 'view_roles', module: 'roles', action: 'read', description: 'View role list' },
        { name: 'Create Roles', slug: 'create_roles', module: 'roles', action: 'create', description: 'Add new roles' },
        { name: 'Edit Roles', slug: 'edit_roles', module: 'roles', action: 'update', description: 'Modify roles' },
        { name: 'Delete Roles', slug: 'delete_roles', module: 'roles', action: 'delete', description: 'Remove roles' },
        { name: 'Assign Permissions', slug: 'assign_permissions', module: 'roles', action: 'manage', description: 'Assign permissions to roles' },

        // Settings Module
        { name: 'View Settings', slug: 'view_settings', module: 'settings', action: 'read', description: 'View system settings' },
        { name: 'Edit Settings', slug: 'edit_settings', module: 'settings', action: 'update', description: 'Modify system settings' },
        { name: 'Manage Company', slug: 'manage_company', module: 'settings', action: 'manage', description: 'Manage company information' },

        // Reports Module
        { name: 'View Reports', slug: 'view_reports', module: 'reports', action: 'read', description: 'View reports and analytics' },
        { name: 'Export Reports', slug: 'export_reports', module: 'reports', action: 'create', description: 'Export reports' }
      ]

      const created = []
      for (const permData of defaultPermissions) {
        const [permission, isCreated] = await Permission.findOrCreate({
          where: { slug: permData.slug },
          defaults: permData
        })
        if (isCreated) {
          created.push(permission)
        }
      }

      return { 
        success: true, 
        message: `Seeded ${created.length} permissions`,
        created: created.length
      }
    } catch (err) {
      console.error('Seed permissions error:', err)
      return { success: false, error: err.message }
    }
  }
}