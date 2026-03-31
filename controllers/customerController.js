const db = require('../models')
const { Customer } = db
const fs = require('fs')
const path = require('path')
const { app } = require('electron')
const { Op } = require('sequelize')

module.exports = {
  /* =======================================================
   SAVE IMAGE
  =========================================================*/
  saveImageLocallyUsingUUID(filePath, uuid) {
    if (!filePath) return null

    const imagesDir = path.join(app.getPath('userData'), 'images/customers')
    if (!fs.existsSync(imagesDir)) fs.mkdirSync(imagesDir, { recursive: true })

    const ext = path.extname(filePath)
    const finalName = `${uuid}${ext}`

    const destPath = path.join(imagesDir, finalName)
    fs.copyFileSync(filePath, destPath)

    return finalName
  },

  /* =======================================================
   GET FULL IMAGE PATH
  =========================================================*/
  getFullImagePath(fileName) {
    if (!fileName) return null

    const imagesDir = path.join(app.getPath('userData'), 'images/customers')
    return path.join(imagesDir, fileName)
  },

  /* =======================================================
   DELETE IMAGE
  =========================================================*/
  deleteImage(filename) {
    try {
      const filePath = path.join(app.getPath('userData'), 'images/customers', filename)
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath)
    } catch (err) {
      console.error('Error deleting customer image:', err)
    }
  },

  /* =======================================================
   CREATE CUSTOMER
  =========================================================*/
  async createCustomer(data) {
    try {
      const customer = await Customer.create({
        customerName: data.customerName,
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
        taxId: data.taxId || null,
        creditLimit: data.creditLimit || 0,
        balance: data.balance || 0,
        status: data.status !== undefined ? data.status : true,
        image: null,
        user_id: data.user_id
      })

      // Image upload
      if (data.image) {
        const imageFile = this.saveImageLocallyUsingUUID(data.image, customer.uuid)
        await customer.update({ image: imageFile })
      }

      return { success: true, customer }
    } catch (err) {
      console.error('Create customer error:', err)
      return { success: false, error: err.message }
    }
  },

  /* =======================================================
   UPDATE CUSTOMER
  =========================================================*/
  async updateCustomer(id, data) {
    try {
      const customer = await Customer.findByPk(id)
      if (!customer) {
        return { success: false, error: 'Customer not found' }
      }

      await customer.update({
        customerName: data.customerName ?? customer.customerName,
        email: data.email ?? customer.email,
        phone: data.phone ?? customer.phone,
        mobile: data.mobile ?? customer.mobile,
        address: data.address ?? customer.address,
        country: data.country ?? customer.country,
        countryCode: data.countryCode ?? customer.countryCode,
        dialCode: data.dialCode ?? customer.dialCode,
        city: data.city ?? customer.city,
        state: data.state ?? customer.state,
        zipCode: data.zipCode ?? customer.zipCode,
        taxId: data.taxId ?? customer.taxId,
        creditLimit: data.creditLimit ?? customer.creditLimit,
        balance: data.balance ?? customer.balance,
        status: data.status !== undefined ? data.status : customer.status
      })

      // Handle new image
      if (data.image) {
        if (customer.image) this.deleteImage(customer.image)

        const newImage = this.saveImageLocallyUsingUUID(data.image, customer.uuid)
        await customer.update({ image: newImage })
      }

      return { success: true, customer }
    } catch (err) {
      console.error('Update customer error:', err)
      return { success: false, error: err.message }
    }
  },

  /* =======================================================
   DELETE CUSTOMER
  =========================================================*/
  async deleteCustomer(id) {
    try {
      const customer = await Customer.findByPk(id)
      if (!customer) {
        return { success: false, error: 'Customer not found' }
      }

      await customer.destroy() // soft delete
      return { success: true }
    } catch (err) {
      console.error('Delete customer error:', err)
      return { success: false, error: err.message }
    }
  },

  /* =======================================================
   GET ONE CUSTOMER
  =========================================================*/
  async getCustomerById(id) {
    try {
      const customer = await Customer.findByPk(id)

      if (!customer) {
        return { success: false, error: 'Customer not found' }
      }

      const plain = customer.get({ plain: true })
      plain.imageUrl = this.getFullImagePath(plain.image)

      return { success: true, customer: plain }
    } catch (err) {
      console.error('Get customer error:', err)
      return { success: false, error: err.message }
    }
  },

  /* =======================================================
   GET ALL CUSTOMERS
  =========================================================*/
  async getCustomers(filters) {
    try {
      const { search, status } = filters
      const where = {}

      if (search) {
        where[Op.or] = [
          { customerName: { [Op.like]: `%${search}%` } },
          { email: { [Op.like]: `%${search}%` } },
          { mobile: { [Op.like]: `%${search}%` } },
          { phone: { [Op.like]: `%${search}%` } }
        ]
      }

      if (status === 'Active') {
        where.status = true
      } else if (status === 'Disabled') {
        where.status = false
      }

      const customers = await Customer.findAll({
        where,
        order: [['customerName', 'ASC']]
      })

      const plain = customers.map((c) => {
        const item = c.get({ plain: true })
        item.imageUrl = this.getFullImagePath(item.image)
        return item
      })

      return { success: true, customers: plain }
    } catch (err) {
      console.error('Get customers error:', err)
      return { success: false, error: err.message }
    }
  }
}