const db = require('../models')
const { Brand } = db
const fs = require('fs')
const path = require('path')
const { app } = require('electron')

module.exports = {
  /* =======================================================
   SAVE IMAGE (LOCAL) USING BRAND UUID
=========================================================*/
  saveImageLocallyUsingUUID(filePath, uuid) {
    if (!filePath) return null

    const imagesDir = path.join(app.getPath('userData'), 'images/brands')
    if (!fs.existsSync(imagesDir)) fs.mkdirSync(imagesDir, { recursive: true })

    // Keep the original extension
    const ext = path.extname(filePath)
    const finalName = `${uuid}${ext}`

    const destPath = path.join(imagesDir, finalName)
    fs.copyFileSync(filePath, destPath)

    return finalName // store filename in DB
  },

  /* =======================================================
   FULL IMAGE PATH
=========================================================*/
  getFullImagePath(fileName) {
    if (!fileName) return null

    const imagesDir = path.join(app.getPath('userData'), 'images/brands')
    return path.join(imagesDir, fileName)
  },

  /* =======================================================
   DELETE IMAGE FROM STORAGE
=========================================================*/
  deleteImage(filename) {
    try {
      const filePath = path.join(app.getPath('userData'), 'images/brands', filename)
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath)
    } catch (err) {
      console.error('Error deleting image:', err)
    }
  },

  /* =======================================================
   CREATE BRAND
=========================================================*/
  async createBrand(data) {
    try {
      // 1. Create brand without image
      const brand = await Brand.create({
        brandName: data.brandName,
        slug: data.slug || null,
        image: null,
        status: data.status !== undefined ? data.status : 1,
        sortOrder: data.sortOrder || 0,
        user_id: data.user_id
      })

      // 2. If image exists → save using brand UUID
      if (data.image) {
        const newImageName = this.saveImageLocallyUsingUUID(data.image, brand.uuid)

        await brand.update({ image: newImageName })
      }

      return { success: true, brand }
    } catch (err) {
      console.error('Create brand error:', err)
      return { success: false, error: err.message }
    }
  },

  /* =======================================================
   UPDATE BRAND
=========================================================*/
  async updateBrand(id, data) {
    try {
      const brand = await Brand.findByPk(id)
      if (!brand) {
        return { success: false, error: 'Brand not found' }
      }

      // Update base fields
      await brand.update({
        brandName: data.brandName ?? brand.brandName,
        slug: data.slug ?? brand.slug,
        status: data.status !== undefined ? data.status : brand.status,
        sortOrder: data.sortOrder ?? brand.sortOrder
      })

      // Handle new image
      if (data.image) {
        // delete old
        if (brand.image) {
          this.deleteImage(brand.image)
        }

        // save new image using existing UUID
        const newImageName = this.saveImageLocallyUsingUUID(data.image, brand.uuid)

        await brand.update({ image: newImageName })
      }

      return { success: true, brand }
    } catch (err) {
      console.error('Update brand error:', err)
      return { success: false, error: err.message }
    }
  },

  /* =======================================================
   DELETE BRAND (SOFT DELETE)
=========================================================*/
  async deleteBrand(id) {
    try {
      const brand = await Brand.findByPk(id)
      if (!brand) {
        return { success: false, error: 'Brand not found' }
      }

      await brand.destroy() // paranoid delete
      return { success: true }
    } catch (err) {
      console.error('Delete brand error:', err)
      return { success: false, error: err.message }
    }
  },

  /* =======================================================
   GET BRAND BY ID
=========================================================*/
  async getBrandById(id) {
    try {
      const brand = await Brand.findByPk(id)

      if (!brand) {
        return { success: false, error: 'Brand not found' }
      }

      const plain = brand.get({ plain: true })
      plain.imageUrl = this.getFullImagePath(plain.image)

      return { success: true, brand: plain }
    } catch (err) {
      console.error('Get brand by ID error:', err)
      return { success: false, error: err.message }
    }
  },

  /* =======================================================
   GET ALL BRANDS
=========================================================*/
  async getBrands() {
    try {
      const brands = await Brand.findAll({
        order: [
          ['sortOrder', 'ASC'],
          ['brandName', 'ASC']
        ]
      })

      const plainBrands = brands.map((b) => {
        const item = b.get({ plain: true })
        item.imageUrl = this.getFullImagePath(item.image)
        return item
      })

      return { success: true, brands: plainBrands }
    } catch (err) {
      console.error('Get brands error:', err)
      return { success: false, error: err.message }
    }
  }
}
