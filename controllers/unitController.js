const db = require('../models')
const { Unit } = db
const { Op } = require('sequelize')

module.exports = {
  async sortUnits(sortedIds) {
    try {
      for (let index = 0; index < sortedIds.length; index++) {
        const id = sortedIds[index]
        await Unit.update({ sortOrder: index + 1 }, { where: { id } })
      }

      const units = await Unit.findAll({ order: [['sortOrder', 'ASC']] })
      return { success: true, units }
    } catch (err) {
      console.error('Sort units error:', err)
      return { success: false, error: err.message }
    }
  },

  // -------------------------------------------------
  // CREATE UNIT
  // -------------------------------------------------
  async createUnit(data) {
    try {
      // Check duplicate name or abbreviation
      const exists = await Unit.findOne({
        where: {
          [Op.or]: [{ unit_name: data.unit_name }, { abbreviation: data.abbreviation }]
        }
      })

      if (exists) {
        return {
          success: false,
          error: 'Unit name or abbreviation already exists.'
        }
      }

      // Validate base_unit_id
      if (data.base_unit_id) {
        const baseUnit = await Unit.findByPk(data.base_unit_id)
        if (!baseUnit) {
          return {
            success: false,
            error: 'Base unit not found.'
          }
        }
      }

      const maxSort = await Unit.max('sortOrder') // get current max sortOrder
      const nextSortOrder = (maxSort || 0) + 1

      const unit = await Unit.create({
        unit_name: data.unit_name,
        abbreviation: data.abbreviation,
        base_unit_id: data.base_unit_id || null,
        universal_conversion: data.universal_conversion || 1,
        notes: data.notes || '',
        user_id: data.user_id.user.id,
        sortOrder: nextSortOrder
      })

      return { success: true, unit }
    } catch (err) {
      console.error('Create unit error:', err)
      return { success: false, error: err.message }
    }
  },

  // -------------------------------------------------
  // GET ALL UNITS (search + filtering)
  // -------------------------------------------------
  async getUnits(filters = {}) {
    try {
      const { search } = filters

      const whereClause = {}

      // SEARCH by name or abbreviation
      if (search && search.trim() !== '') {
        whereClause[Op.or] = [
          { unit_name: { [Op.like]: `%${search}%` } },
          { abbreviation: { [Op.like]: `%${search}%` } }
        ]
      }

      const units = await Unit.findAll({
        where: whereClause,
        order: [
          ['sortOrder', 'ASC'],
          ['unit_name', 'ASC']
        ]
      })

      const plainUnits = units.map((u) => ({
        ...u.get({ plain: true }),
        createdAt: u.createdAt?.toISOString(),
        updatedAt: u.updatedAt?.toISOString()
      }))

      return { success: true, units: plainUnits }
    } catch (err) {
      console.error('Get units error:', err)
      return { success: false, error: err.message }
    }
  },

  // -------------------------------------------------
  // GET UNIT BY ID
  // -------------------------------------------------
  async getUnit(id) {
    try {
      const unit = await Unit.findByPk(id)

      if (!unit) {
        return { success: false, error: 'Unit not found' }
      }

      return { success: true, unit }
    } catch (err) {
      return { success: false, error: err.message }
    }
  },

  // -------------------------------------------------
  // UPDATE UNIT
  // -------------------------------------------------
  async updateUnit(id, data) {
    try {
      const unit = await Unit.findByPk(id)

      if (!unit) {
        return { success: false, error: 'Unit not found' }
      }

      // Duplicate check when updating
      const exists = await Unit.findOne({
        where: {
          [Op.or]: [{ unit_name: data.unit_name }, { abbreviation: data.abbreviation }],
          id: { [Op.ne]: id } // exclude current record
        }
      })

      if (exists) {
        return {
          success: false,
          error: 'Unit name or abbreviation already exists.'
        }
      }

      // Validate base unit if provided
      if (data.base_unit_id && data.base_unit_id !== unit.base_unit_id) {
        const baseUnit = await Unit.findByPk(data.base_unit_id)
        if (!baseUnit) {
          return { success: false, error: 'Base unit not found.' }
        }
      }

      await unit.update(data)

      return { success: true, unit }
    } catch (err) {
      console.error('Update unit error:', err)
      return { success: false, error: err.message }
    }
  },

  // -------------------------------------------------
  // SOFT DELETE UNIT
  // -------------------------------------------------
  async softDeleteUnit(id) {
    try {
      const unit = await Unit.findByPk(id)

      if (!unit) {
        return { success: false, error: 'Unit not found' }
      }

      await unit.destroy()

      return { success: true }
    } catch (err) {
      return { success: false, error: err.message }
    }
  },

  // -------------------------------------------------
  // RESTORE SOFT DELETED UNIT
  // -------------------------------------------------
  async restoreUnit(id) {
    try {
      const unit = await Unit.findOne({
        where: { id },
        paranoid: false
      })

      if (!unit) {
        return { success: false, error: 'Unit not found' }
      }

      await unit.restore()
      return { success: true }
    } catch (err) {
      return { success: false, error: err.message }
    }
  }
}
