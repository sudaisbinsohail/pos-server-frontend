const db = require('../models')
const { Role, Permission, User ,sequelize ,Unit} = db
const { Op } = require('sequelize')

module.exports = {
  /* =======================================================
   CREATE ROLE
  =========================================================*/
  async createRole(data) {
    const transaction = await db.sequelize.transaction()
    
    try {
      // Check if role already exists
      const existingRole = await Role.findOne({
        where: { 
          [Op.or]: [
            { name: data.name },
            // { slug: data.slug }
          ]
        }
      })

      if (existingRole) {
        return { success: false, error: 'Role name or slug already exists' }
      }

      // Create role
      const rawName = (data.name || '').trim();
      const role = await Role.create({
      name: rawName.toLowerCase(),                 // admin
    display_name: rawName.charAt(0).toUpperCase() + rawName.slice(1).toLowerCase(), // Admin
        // slug: data.slug,
        description: data.description || null,
        is_system: false,
        is_active: data.is_active !== undefined ? data.is_active : true
      }, { transaction })

      // Assign permissions if provided
      if (data.permissions && data.permissions.length > 0) {
        await role.setPermissions(data.permissions, { transaction })
      }

      await transaction.commit()

      // Fetch role with permissions
      const roleWithPermissions = await Role.findByPk(role.id, {
        include: [{ model: Permission, as: 'permissions' }]
      })

    //   return { success: true, role: roleWithPermissions }
    return { success: true, role: roleWithPermissions.get({ plain: true }) }

    } catch (err) {
      await transaction.rollback()
      console.error('Create role error:', err)
      return { success: false, error: err.message }
    }
  },

  /* =======================================================
   UPDATE ROLE
  =========================================================*/
  async updateRole(id, data) {
    const transaction = await db.sequelize.transaction()
    
    try {
      const role = await Role.findByPk(id)
      
      if (!role) {
        return { success: false, error: 'Role not found' }
      }

      // Prevent modification of system roles
      if (role.is_system) {
        return { success: false, error: 'System roles cannot be modified' }
      }

      // Check for duplicate name/slug (excluding current role)
      if (data.name || data.slug) {
        const existingRole = await Role.findOne({
          where: {
            [Op.or]: [
              data.name ? { name: data.name } : null,
              data.slug ? { slug: data.slug } : null
            ].filter(Boolean),
            id: { [Op.ne]: id }
          }
        })

        if (existingRole) {
          return { success: false, error: 'Role name or slug already exists' }
        }
      }

      // Update role
      await role.update({
        name: data.name || role.name,
        // slug: data.slug || role.slug,
        description: data.description !== undefined ? data.description : role.description,
        is_active: data.is_active !== undefined ? data.is_active : role.is_active
      }, { transaction })

      // Update permissions if provided
      if (data.permissions !== undefined) {
        await role.setPermissions(data.permissions, { transaction })
      }

      await transaction.commit()

      // Fetch updated role with permissions
      const updatedRole = await Role.findByPk(id, {
        include: [{ model: Permission, as: 'permissions' }]
      })

    //   return { success: true, role: updatedRole }
     return { success: true, role: updatedRole.get({ plain: true }) }
    } catch (err) {
      await transaction.rollback()
      console.error('Update role error:', err)
      return { success: false, error: err.message }
    }
  },

  /* =======================================================
   DELETE ROLE
  =========================================================*/
  async deleteRole(id) {
    try {
      const role = await Role.findByPk(id, {
        include: [{ model: User, as: 'users' }]
      })

      if (!role) {
        return { success: false, error: 'Role not found' }
      }

      // Prevent deletion of system roles
      if (role.is_system) {
        return { success: false, error: 'System roles cannot be deleted' }
      }

      // Check if role is assigned to any users
      if (role.users && role.users.length > 0) {
        return { 
          success: false, 
          error: `Cannot delete role. ${role.users.length} user(s) are assigned to this role` 
        }
      }

      await role.destroy()
      return { success: true }
    } catch (err) {
      console.error('Delete role error:', err)
      return { success: false, error: err.message }
    }
  },

  /* =======================================================
   GET ROLE BY ID
  =========================================================*/
  async getRoleById(id) {
    try {
      const role = await Role.findByPk(id, {
        include: [
          { 
            model: Permission, 
            as: 'permissions',
            attributes: ['id', 'name', 'module', 'action', 'description']
          },
          {
            model: User,
            as: 'users',
            attributes: ['id', 'name', 'email']
          }
        ]
      })

      if (!role) {
        return { success: false, error: 'Role not found' }
      }

      return { success: true, role: role.get({ plain: true }) }
    } catch (err) {
      console.error('Get role error:', err)
      return { success: false, error: err.message }
    }
  },

  /* =======================================================
   GET ALL ROLES
  =========================================================*/
  async getRoles(filters = {}) {
    try {
      const { search, status } = filters
      const where = {}

      if (search) {
        where[Op.or] = [
          { name: { [Op.like]: `%${search}%` } },
          { description: { [Op.like]: `%${search}%` } }
        ]
      }

      if (status !== undefined && status !== 'all') {
        where.status = status === 'active' || status === true
      }

      const roles = await Role.findAll({
        where,
        include: [
          { 
            model: Permission, 
            as: 'permissions',
            attributes: ['id', 'name']
          }
        ],
        order: [
          ['is_system_role', 'DESC'],
          ['name', 'ASC']
        ]
      })

      const plainRoles = roles.map(r => {
        const role = r.get({ plain: true })
        role.permissions_count = role.permissions?.length || 0
        return role
      })

      return { success: true, roles: plainRoles }
    } catch (err) {
      console.error('Get roles error:', err)
      return { success: false, error: err.message }
    }
  },

  /* =======================================================
   ASSIGN PERMISSIONS TO ROLE
  =========================================================*/
  async assignPermissions(roleId, permissionIds) {
    const transaction = await db.sequelize.transaction()
    
    try {
      const role = await Role.findByPk(roleId)

      if (!role) {
        return { success: false, error: 'Role not found' }
      }

      if (role.is_system) {
        return { success: false, error: 'Cannot modify system role permissions' }
      }

      // Verify all permissions exist
      const permissions = await Permission.findAll({
        where: { id: permissionIds }
      })

      if (permissions.length !== permissionIds.length) {
        return { success: false, error: 'Some permissions not found' }
      }

      await role.setPermissions(permissionIds, { transaction })
      await transaction.commit()

      return { success: true }
    } catch (err) {
      await transaction.rollback()
      console.error('Assign permissions error:', err)
      return { success: false, error: err.message }
    }
  },


async checkPermission(userId, permissionName) {
  try {
    const user = await User.findByPk(userId)

    if (!user || !user.role_id) {
      return { success: false, hasPermission: false }
    }

    const permission = await Permission.findOne({
      where: { name: permissionName },
      include: [{
        model: Role,
        as: "roles",
        where: { id: user.role_id },
        required: true,
        through: { attributes: [] }
      }]
    })

    return { success: true, hasPermission: !!permission }
  } catch (err) {
    console.error("Check permission error:", err)
    return { success: false, hasPermission: false, error: err.message }
  }
},
  /* =======================================================
   GET USER PERMISSIONS
  =========================================================*/
  async getUserPermissions(userId) {
    try {
      const user = await User.findByPk(userId, {
        include: [{
          model: Role,
          as: 'role',
          include: [{
            model: Permission,
            as: 'permissions',
            attributes: ['id', 'name', 'module', 'action']
          }]
        }]
      })

      if (!user || !user.role) {
        return { success: false, permissions: [] }
      }

      const permissions = user.role.permissions || []
      return { success: true, permissions: permissions.map(p => p.get({ plain: true })) }
    } catch (err) {
      console.error('Get user permissions error:', err)
      return { success: false, permissions: [], error: err.message }
    }
  },



}
