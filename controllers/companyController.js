const db = require('../models')
const { Company } = db

module.exports = {
  async exists() {
    try {
      const count = await Company.count()
      return { exists: count > 0 }
    } catch (err) {
      console.error('Company exists check error:', err)
      return { exists: false, error: err.message }
    }
  },
  async createCompany(data) {
    try {
      const company = await Company.create({
        name: data.name,
        address: data.address,
        phone: data.phone,
        country_name: data.country_name,
        currency: data.currency,
      })
      return { success: true, company }
    } catch (err) {
      console.error('Create company error:', err)
      return { success: false, error: err.message }
    }
  },
   async getCompany(id) {
    try {
      const company = await Company.findByPk(id)

      if (!company) {
        return { success: false, message: 'Company not found' }
      }

      return { success: true, company }
    } catch (err) {
      console.error('Get company error:', err)
      return { success: false, error: err.message }
    }
  },

  async updateCompany(id , data) {
    try {
      const company = await Company.findByPk(id)

      if (!company) {
        return { success: false, message: 'Company not found' }
      }

      await company.update({
        name: data.name,
        address: data.address,
        phone: data.phone,
        country: data.country,
        currency: data.currency,
      })

      return { success: true, company }
    } catch (err) {
      console.error('Update company error:', err)
      return { success: false, error: err.message }
    }
  },




}
