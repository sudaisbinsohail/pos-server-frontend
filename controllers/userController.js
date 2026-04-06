const db = require('../models')
const bcrypt = require('bcryptjs')
const { User, Company , Role , Permission} = db
const Store = require('electron-store')
const { Op } = require('sequelize')

module.exports = {
  // async createUser(data) {
  //   try {
  //     const company = await Company.findOne()

  //     if (!company) {
  //       return {
  //         success: false,
  //         error: 'No company found. Create a company first.'
  //       }
  //     }

  //     const user = await User.create({
  //       name: data.name,
  //       email: data.email,
  //       role: data.role,
  //       password_hash: data.password,
  //       company_id: company.id
  //     })

  //     return { success: true, user }
  //   } catch (err) {
  //     console.error('Create user error:', err)
  //     return { success: false, error: err.message }
  //   }
  // },

  async createUser(data) {
    try {
      const company = await Company.findOne()

      if (!company) {
        return {
          success: false,
          error: 'No company found. Create a company first.'
        }
      }

      // Validate role_id exists
      const role = await Role.findByPk(data.role_id)
      if (!role) {
        return {
          success: false,
          error: 'Invalid role selected.'
        }
      }

      const user = await User.create({
        name: data.name,
        email: data.email,
        role_id: data.role_id,
        password_hash: data.password,
        company_id: company.id
      })

      return { success: true, user }
    } catch (err) {
      console.error('Create user error:', err)
      return { success: false, error: err.message }
    }
  },


async authUser(email, password) {
  try {
    const user = await User.findOne({
      where: { email },
      include: [
        {
          model: Role,
          as: 'role',
          include: [
            {
              model: Permission,
              as: 'permissions'
            }
          ]
        }
      ]
    });

    if (!user) {
      return { success: false, error: 'User not found' };
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return { success: false, error: 'Invalid password' };
    }

    // Convert Sequelize instance and all nested associations to plain object
    const plainUser = user.get({ plain: true });

    return { success: true, user: plainUser };

  } catch (err) {
    console.error('Auth user error:', err);
    return { success: false, error: err.message };
  }
},

  async userSession(user) {
    try {
      const store = new Store()
      store.set('user', user)
      // console.log("User session set:", store.get('user'));
      return { success: true }
    } catch (err) {
      // console.error("User session error:", err);
      return { success: false, error: err.message }
    }
  },

  async getUserSession() {
    try {
      const store = new Store()
      const user = store.get('user')
      // console.log("Retrieved user session:", user);
      return { success: true, user }
    } catch (err) {
      return { success: false, error: err.message }
    }
  },

  async removeUserSession() {
    try {
      const store = new Store()
      store.delete('user')
      return { success: true }
    } catch (err) {
      return { success: false, error: err.message }
    }
  },

  async getUsers(filters = {}) {
    try {
      const { search, role } = filters

      const whereClause = {}

      // ROLE FILTER (ignore "All")
      if (role && role !== 'All') {
        whereClause.role = role
      }

      // SEARCH FILTER (search in name OR email)
      if (search && search.trim() !== '') {
        whereClause[Op.or] = [
          { name: { [Op.like]: `%${search}%` } },
          { email: { [Op.like]: `%${search}%` } }
        ]
      }

      const users = await User.findAll({ where: whereClause })

      const plainUsers = users.map((user) => {
        const u = user.get({ plain: true })
        return {
          ...u,
          createdAt: u.createdAt?.toISOString(),
          updatedAt: u.updatedAt?.toISOString()
        }
      })

      return { success: true, users: plainUsers }
    } catch (err) {
      return { success: false, error: err.message }
    }
  },

  async softDeleteUser(userId) {
    try {
      const user = await User.findByPk(userId)

      if (!user) {
        return { success: false, error: 'User not found' }
      }
      await user.destroy()
      return { success: true }
    } catch (err) {
      return { success: false, error: err.message }
    }
  },

  // async updateUser(userId, data) {
  //   try {
  //     const user = await User.findByPk(userId)
  //     if (!user) {
  //       return { success: false, error: 'User not found' }
  //     }
  //     await user.update(data)
  //     return { success: true, user }
  //   } catch (err) {
  //     return { success: false, error: err.message }
  //   }
  // },

//   async adminExists() {
//     try {
//       // const count = await User.count({ where: { role: 'admin' } })
//       const count = await User.count({
//   where: {
//     role: {
//       [Op.or]: ['Admin', 'admin']
//     }
//   }
// });
//       return { exists: count > 0 }
//     } catch (err) {
//       console.error('Admin exists check error:', err)
//       return { exists: false, error: err.message }
//     }
//   }


async updateUser(userId, data) {
    try {
      const user = await User.findByPk(userId)
      if (!user) {
        return { success: false, error: 'User not found' }
      }

      // If role_id is provided, validate it
      if (data.role_id) {
        const role = await Role.findByPk(data.role_id)
        if (!role) {
          return { success: false, error: 'Invalid role selected' }
        }
      }

      await user.update(data)
      return { success: true, user }
    } catch (err) {
      return { success: false, error: err.message }
    }
  },
async adminExists() {
  try {
    // First, find the role id of the system admin
    const adminRole = await Role.findOne({
      where: { name: 'admin', is_system_role: true }
    });

    if (!adminRole) {
      return { exists: false, error: 'Admin role not found' };
    }

    // Count users with this role_id
    const count = await User.count({
      where: { role_id: adminRole.id }
    });

    return { exists: count > 0 };
  } catch (err) {
    console.error('Admin exists check error:', err);
    return { exists: false, error: err.message };
  }
},


}
