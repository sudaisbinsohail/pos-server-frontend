const db = require('../models')
const { Supplier } = db
const fs = require('fs')
const path = require('path')
const { app } = require('electron')
const { Op } = require('sequelize')
module.exports = {
  /* =======================================================
   SAVE IMAGE LOCALLY (SUPPLIER)
=========================================================*/
  saveImageLocallyUsingUUID(filePath, uuid) {
    if (!filePath) return null

    const imagesDir = path.join(app.getPath('userData'), 'images/suppliers')
    if (!fs.existsSync(imagesDir)) fs.mkdirSync(imagesDir, { recursive: true })

    const ext = path.extname(filePath)
    const finalName = `${uuid}${ext}`

    const destPath = path.join(imagesDir, finalName)
    fs.copyFileSync(filePath, destPath)

    return finalName
  },

  /* =======================================================
   FULL IMAGE PATH
=========================================================*/
  getFullImagePath(fileName) {
    if (!fileName) return null

    const imagesDir = path.join(app.getPath('userData'), 'images/suppliers')
    return path.join(imagesDir, fileName)
  },

  /* =======================================================
   DELETE IMAGE
=========================================================*/
  deleteImage(filename) {
    try {
      const filePath = path.join(app.getPath('userData'), 'images/suppliers', filename)
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath)
    } catch (err) {
      console.error('Error deleting supplier image:', err)
    }
  },

  /* =======================================================
   CREATE SUPPLIER
=========================================================*/
  async createSupplier(data) {
    try {
      const supplier = await Supplier.create({
        supplierName: data.supplierName,
        email: data.email || null,
        phone: data.phone || null,
        mobile: data.mobile || null,
        address: data.address || null,

        country: data.country || null,
        countryCode: data.countryCode || null,
        dialCode: data.dialCode || null,
        city: data.city || null,
        state: data.state || null,
        zipCode: data.zipCode || null,

        currency: data.currency || 'USD',
        taxId: data.taxId || null,
        paymentTerms: data.paymentTerms || null,

        status: data.status !== undefined ? data.status : true,
        image: null,
        user_id: data.user_id
      })

      // Image upload
      if (data.image) {
        const imageFile = this.saveImageLocallyUsingUUID(data.image, supplier.uuid)
        await supplier.update({ image: imageFile })
      }

      return { success: true, supplier }
    } catch (err) {
      console.error('Create supplier error:', err)
      return { success: false, error: err.message }
    }
  },

  /* =======================================================
   UPDATE SUPPLIER
=========================================================*/
  async updateSupplier(id, data) {
    try {
      const supplier = await Supplier.findByPk(id)
      if (!supplier) {
        return { success: false, error: 'Supplier not found' }
      }

      await supplier.update({
        supplierName: data.supplierName ?? supplier.supplierName,
        email: data.email ?? supplier.email,
        phone: data.phone ?? supplier.phone,
        mobile: data.mobile ?? supplier.mobile,
        address: data.address ?? supplier.address,

        country: data.country ?? supplier.country,
        countryCode: data.countryCode ?? supplier.countryCode,
        dialCode: data.dialCode ?? supplier.dialCode,
        city: data.city ?? supplier.city,
        state: data.state ?? supplier.state,
        zipCode: data.zipCode ?? supplier.zipCode,

        currency: data.currency ?? supplier.currency,
        taxId: data.taxId ?? supplier.taxId,
        paymentTerms: data.paymentTerms ?? supplier.paymentTerms,

        status: data.status !== undefined ? data.status : supplier.status
      })

      // Handle new image
      if (data.image) {
        if (supplier.image) this.deleteImage(supplier.image)

        const newImage = this.saveImageLocallyUsingUUID(data.image, supplier.uuid)
        await supplier.update({ image: newImage })
      }

      return { success: true, supplier }
    } catch (err) {
      console.error('Update supplier error:', err)
      return { success: false, error: err.message }
    }
  },

  /* =======================================================
   DELETE SUPPLIER
=========================================================*/
  async deleteSupplier(id) {
    try {
      const supplier = await Supplier.findByPk(id)
      if (!supplier) {
        return { success: false, error: 'Supplier not found' }
      }

      // Remove local image
      if (supplier.image) this.deleteImage(supplier.image)

      await supplier.destroy() // soft delete
      return { success: true }
    } catch (err) {
      console.error('Delete supplier error:', err)
      return { success: false, error: err.message }
    }
  },

  /* =======================================================
   GET ONE SUPPLIER
=========================================================*/
  async getSupplierById(id) {
    try {
      const supplier = await Supplier.findByPk(id)

      if (!supplier) {
        return { success: false, error: 'Supplier not found' }
      }

      const plain = supplier.get({ plain: true })
      plain.imageUrl = this.getFullImagePath(plain.image)

      return { success: true, supplier: plain }
    } catch (err) {
      console.error('Get supplier error:', err)
      return { success: false, error: err.message }
    }
  },

  async getSuppliers(filters) {
    try {
      const { search, status } = filters

      // search can be text for name, email, country
      // status can be 'active', 'disabled', or undefined

      // Build dynamic where condition
      const where = {}

      if (search) {
        where[Op.or] = [
          { supplierName: { [Op.like]: `%${search}%` } },
          { email: { [Op.like]: `%${search}%` } },
          { country: { [Op.like]: `%${search}%` } }
        ]
      }

      if (status === 'Active') {
        where.status = true
      } else if (status === 'Disabled') {
        where.status = false
      }

      const suppliers = await Supplier.findAll({
        where,
        order: [['supplierName', 'ASC']]
      })

      const plain = suppliers.map((s) => {
        const item = s.get({ plain: true })
        item.imageUrl = this.getFullImagePath(item.image)
        return item
      })

      return { success: true, suppliers: plain }
    } catch (err) {
      console.error('Get suppliers error:', err)
      return { success: false, error: err.message }
    }
  }
}
