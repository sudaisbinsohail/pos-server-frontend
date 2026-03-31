const db = require('../models')
const { Product, Category, Brand, Unit, ProductUnit, User } = db
const fs = require('fs')
const path = require('path')
const { app } = require('electron')
const { Op } = require('sequelize')




module.exports = {
  /* =======================================================
   SAVE PRODUCT IMAGE LOCALLY USING UUID
=========================================================*/
  saveImageLocallyUsingUUID(filePath, uuid) {
    if (!filePath) return null

    const imagesDir = path.join(app.getPath('userData'), 'images/products')
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

    const imagesDir = path.join(app.getPath('userData'), 'images/products')
    return path.join(imagesDir, fileName)
  },

  /* =======================================================
   DELETE IMAGE FROM STORAGE
=========================================================*/
  deleteImage(filename) {
    try {
      const filePath = path.join(app.getPath('userData'), 'images/products', filename)
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath)
    } catch (err) {
      console.error('Error deleting product image:', err)
    }
  },




  //===========validation code
// async validateGlobalBarcode({
//   productBarcode,
//   unitBarcodes = [],
//   excludeProductId = null
// }) {
//   // Make sure barcodes are unique within the product itself
//   if (productBarcode && unitBarcodes.includes(productBarcode)) {
//     throw new Error('Product barcode cannot be the same as any of its unit barcodes')
//   }

//   // 1️⃣ Check product barcode against other products
//   if (productBarcode) {
//     const productConflict = await Product.findOne({
//       where: {
//         barcode: productBarcode,
//         ...(excludeProductId ? { id: { [Op.ne]: excludeProductId } } : {})
//       }
//     })

//     if (productConflict) {
//       throw new Error(`Product barcode already exists: ${productConflict.barcode}`)
//     }

//     // Also check against all units
//     const unitConflict = await ProductUnit.findOne({
//       where: {
//         barcode: productBarcode
//       }
//     })

//     if (unitConflict) {
//       throw new Error(`Product barcode conflicts with an existing unit barcode: ${unitConflict.barcode}`)
//     }
//   }

//   if (unitBarcodes.length) {
//     // 2️⃣ Check unit barcodes against other products
//     const productConflict = await Product.findOne({
//       where: {
//         barcode: { [Op.in]: unitBarcodes },
//         ...(excludeProductId ? { id: { [Op.ne]: excludeProductId } } : {})
//       }
//     })

//     if (productConflict) {
//       throw new Error(
//         `Unit barcode conflicts with product barcode: ${productConflict.barcode}`
//       )
//     }

//     // 3️⃣ Check unit barcodes against other units
//     const unitConflict = await ProductUnit.findOne({
//       where: {
//         barcode: { [Op.in]: unitBarcodes },
//         ...(excludeProductId ? { product_id: { [Op.ne]: excludeProductId } } : {})
//       }
//     })

//     if (unitConflict) {
//       throw new Error(
//         `Unit barcode already exists: ${unitConflict.barcode}`
//       )
//     }
//   }
// },

async validateGlobalBarcode({
  productBarcode,
  unitBarcodes = [],
  excludeProductId = null
}) {
  // 0️⃣ Check duplicates inside the request itself
  const duplicates = unitBarcodes.filter((item, index, arr) => arr.indexOf(item) !== index)
  if (productBarcode && unitBarcodes.includes(productBarcode)) {
    throw new Error('Product barcode cannot be the same as any of its unit barcodes')
  }
  if (duplicates.length) {
    throw new Error(`Duplicate unit barcodes in request: ${duplicates.join(', ')}`)
  }

  // 1️⃣ Check product barcode against other products (excluding self)
  if (productBarcode) {
    const productConflict = await Product.findOne({
      where: {
        barcode: productBarcode,
        ...(excludeProductId ? { id: { [Op.ne]: excludeProductId } } : {})
      }
    })
    if (productConflict) {
      throw new Error(`Product barcode already exists: ${productConflict.barcode}`)
    }

    // 2️⃣ Check product barcode against all other units (excluding self)
    const unitConflict = await ProductUnit.findOne({
      where: {
        barcode: productBarcode,
        ...(excludeProductId ? { product_id: { [Op.ne]: excludeProductId } } : {})
      }
    })
    if (unitConflict) {
      throw new Error(`Product barcode conflicts with an existing unit barcode: ${unitConflict.barcode}`)
    }
  }

  if (unitBarcodes.length) {
    // 3️⃣ Check unit barcodes against other products (excluding self)
    const productConflict = await Product.findOne({
      where: {
        barcode: { [Op.in]: unitBarcodes },
        ...(excludeProductId ? { id: { [Op.ne]: excludeProductId } } : {})
      }
    })
    if (productConflict) {
      throw new Error(
        `Unit barcode conflicts with product barcode: ${productConflict.barcode}`
      )
    }

    // 4️⃣ Check unit barcodes against other units (excluding self)
    const unitConflict = await ProductUnit.findOne({
      where: {
        barcode: { [Op.in]: unitBarcodes },
        ...(excludeProductId ? { product_id: { [Op.ne]: excludeProductId } } : {})
      }
    })
    if (unitConflict) {
      throw new Error(
        `Unit barcode already exists: ${unitConflict.barcode}`
      )
    }
  }
},



  /* =======================================================
   CREATE PRODUCT
=========================================================*/
async createProduct(data) {
  const transaction = await Product.sequelize.transaction()
  try {
    if (!data.name || !data.base_unit_id) {
      return { success: false, error: 'Product name and base unit are required' }
    }

    // SKU check
    if (data.sku) {
      const skuExists = await Product.findOne({ where: { sku: data.sku } })
      if (skuExists) return { success: false, error: 'SKU already exists' }
    }

    const unitBarcodes = (data.units || [])
      .map(u => u.barcode)
      .filter(Boolean)

    // 🔒 GLOBAL BARCODE VALIDATION (use `this.`)
    await this.validateGlobalBarcode({
      productBarcode: data.barcode,
      unitBarcodes
    })

    const product = await Product.create({
      name: data.name,
      sku: data.sku || null,
      category_id: data.category_id || null,
      brand_id: data.brand_id || null,
      base_unit_id: data.base_unit_id,
      buying_price: data.buying_price || 0,
      cost_price: data.cost_price || 0,
      selling_price: data.selling_price || 0,
      tax_percent: data.tax_percent || 0,
      min_stock_level: data.min_stock_level || 0,
      opening_stock: data.opening_stock || 0,
      barcode: data.barcode || null,
      description: data.description || null,
      image: null,
      user_id: data.user_id,
      status: data.status ?? 'active'
    }, { transaction })

    if (data.image) {
      const imageFile = this.saveImageLocallyUsingUUID(data.image, product.uuid)
      await product.update({ image: imageFile }, { transaction })
    }

    if (data.units?.length) {
      await ProductUnit.bulkCreate(
        data.units.map(unit => ({
          product_id: product.id,
          unit_id: unit.unit_id,
          base_unit_id: data.base_unit_id,
          conversion_value: unit.conversion_value || 1,
          selling_price: unit.selling_price || 0,
          purchase_price: unit.purchase_price || 0,
          barcode: unit.barcode || null,
          sku: unit.sku || null
        })),
        { transaction }
      )
    }

    await transaction.commit()

    return { success: true, product }
  } catch (err) {
    await transaction.rollback()
    return { success: false, error: err.message }
  }
},



  /* =======================================================
   UPDATE PRODUCT
=========================================================*/
async updateProduct(id, data) {
  const transaction = await Product.sequelize.transaction()
  try {
    const product = await Product.findByPk(id, { transaction })
    if (!product) return { success: false, error: 'Product not found' }

    const unitBarcodes = (data.units || [])
      .map(u => u.barcode)
      .filter(Boolean)

    // 🔒 GLOBAL BARCODE VALIDATION
    // Note: Include product barcode & all unit barcodes in validation
    // await this.validateGlobalBarcode({
    //   productBarcode: data.barcode && data.barcode !== product.barcode ? data.barcode : null,
    //   unitBarcodes,
    //   excludeProductId: id
    // })


    const finalProductBarcode = data.barcode ?? product.barcode;

await this.validateGlobalBarcode({
  productBarcode: finalProductBarcode,
  unitBarcodes,
  excludeProductId: id
});


    // Update main product
    await product.update({
      name: data.name ?? product.name,
      sku: data.sku ?? product.sku,
      category_id: data.category_id ?? product.category_id,
      brand_id: data.brand_id ?? product.brand_id,
      base_unit_id: data.base_unit_id ?? product.base_unit_id,
      buying_price: data.buying_price ?? product.buying_price,
      cost_price: data.cost_price ?? product.cost_price,
      selling_price: data.selling_price ?? product.selling_price,
      tax_percent: data.tax_percent ?? product.tax_percent,
      min_stock_level: data.min_stock_level ?? product.min_stock_level,
      opening_stock: data.opening_stock ?? product.opening_stock,
      barcode: data.barcode ?? product.barcode,
      description: data.description ?? product.description,
      status: data.status ?? product.status
    }, { transaction })

    // Handle image
    if (data.image) {
      if (product.image) this.deleteImage(product.image)
      const newImage = this.saveImageLocallyUsingUUID(data.image, product.uuid)
      await product.update({ image: newImage }, { transaction })
    }

    // ⚠️ Full DELETE old units and recreate
    if (Array.isArray(data.units)) {
      // Delete all previous units fully
      await ProductUnit.destroy({
        where: { product_id: id },
        force: true,
        transaction
      })

      // Create new units
      if (data.units.length) {
        const unitsToCreate = data.units.map(unit => ({
          product_id: id,
          unit_id: unit.unit_id,
          base_unit_id: product.base_unit_id,
          conversion_value: unit.conversion_value || 1,
          selling_price: unit.selling_price || 0,
          purchase_price: unit.purchase_price || 0,
          barcode: unit.barcode || null,
          sku: unit.sku || null
        }))

        await ProductUnit.bulkCreate(unitsToCreate, { transaction })
      }
    }

    await transaction.commit()

    // Return updated product with units included
    const updatedProduct = await Product.findByPk(id, {
      include: [
        { model: ProductUnit, as: 'units' },
        { model: Category, as: 'category' },
        { model: Brand, as: 'brand' },
        { model: Unit, as: 'base_unit' }
      ]
    })

    return { success: true, product: updatedProduct.get({ plain: true }) }

  } catch (err) {
    await transaction.rollback()
    return { success: false, error: err.message }
  }
},




  /* =======================================================
   DELETE PRODUCT (SOFT DELETE)
=========================================================*/


  async deleteProduct(id) {
  const transaction = await Product.sequelize.transaction();
  try {
    const product = await Product.findByPk(id);
    if (!product) {
      return { success: false, error: 'Product not found' };
    }

    // 1️⃣ Soft delete all product units
    await ProductUnit.update(
      { deletedAt: new Date() }, // mark as deleted
      {
        where: { product_id: id },
        force:true,
        transaction
      }
    );

    // 2️⃣ Soft delete the product itself
    await product.destroy({ force:true,transaction }); // soft delete

    await transaction.commit();
    return { success: true };
  } catch (err) {
    await transaction.rollback();
    console.error('Delete product error:', err);
    return { success: false, error: err.message };
  }
},


  /* =======================================================
   RESTORE PRODUCT
=========================================================*/
  async restoreProduct(id) {
    try {
      const product = await Product.findOne({
        where: { id },
        paranoid: false
      })

      if (!product) {
        return { success: false, error: 'Product not found' }
      }

      await product.restore()
      return { success: true, product }
    } catch (err) {
      console.error('Restore product error:', err)
      return { success: false, error: err.message }
    }
  },

  /* =======================================================
   GET PRODUCT BY ID
=========================================================*/
  async getProductById(id) {
    try {
      const product = await Product.findByPk(id, {
        include: [
          { model: Category, as: 'category' },
          { model: Brand, as: 'brand' },
          { model: Unit, as: 'base_unit' },
          {
            model: ProductUnit,
            as: 'units',
            include: [{ model: Unit, as: 'unit' }]
          },
          { model: User, as: 'user', attributes: ['id', 'name', 'email'] }
        ]
      })

      if (!product) {
        return { success: false, error: 'Product not found' }
      }

      const plain = product.get({ plain: true })
      plain.imageUrl = this.getFullImagePath(plain.image)

      // Add image URLs for category and brand if they exist
      if (plain.category?.image) {
        const categoryImagesDir = path.join(app.getPath('userData'), 'images/categories')
        plain.category.imageUrl = path.join(categoryImagesDir, plain.category.image)
      }

      if (plain.brand?.image) {
        const brandImagesDir = path.join(app.getPath('userData'), 'images/brands')
        plain.brand.imageUrl = path.join(brandImagesDir, plain.brand.image)
      }

      return { success: true, product: plain }
    } catch (err) {
      console.error('Get product error:', err)
      return { success: false, error: err.message }
    }
  },

  /* =======================================================
   GET ALL PRODUCTS WITH FILTERS
=========================================================*/
  async getProducts(filters = {}) {
    try {
      const {
        search,
        category_id,
        brand_id,
        status,
        min_price,
        max_price
      } = filters

      const whereClause = {}

      // SEARCH: by name, SKU, or barcode
      if (search && search.trim() !== '') {
        whereClause[Op.or] = [
          { name: { [Op.like]: `%${search}%` } },
          { sku: { [Op.like]: `%${search}%` } },
          { barcode: { [Op.like]: `%${search}%` } },
          { '$units.barcode$': { [Op.like]: `%${search}%` } }
        ]
      }

      // FILTER by category
      if (category_id) {
        whereClause.category_id = category_id
      }

      // FILTER by brand
      if (brand_id) {
        whereClause.brand_id = brand_id
      }

      // FILTER by status
      if (status) {
        whereClause.status = status
      }

      // FILTER by price range
      if (min_price !== undefined || max_price !== undefined) {
        whereClause.selling_price = {}
        if (min_price !== undefined) {
          whereClause.selling_price[Op.gte] = min_price
        }
        if (max_price !== undefined) {
          whereClause.selling_price[Op.lte] = max_price
        }
      }

      const products = await Product.findAll({
        where: whereClause,
        include: [
          { model: Category, as: 'category', attributes: ['id', 'categoryName', 'slug'] },
          { model: Brand, as: 'brand', attributes: ['id', 'brandName', 'slug'] },
          { model: Unit, as: 'base_unit', attributes: ['id', 'unit_name', 'abbreviation'] },
          {
            model: ProductUnit,
            as: 'units',
            include: [{ model: Unit, as: 'unit', attributes: ['id', 'unit_name', 'abbreviation'] }]
          }
        ],
        order: [['name', 'ASC']]
      })

      const plainProducts = products.map(product => {
        const item = product.get({ plain: true })
        item.imageUrl = this.getFullImagePath(item.image)

        // Add category image URL
        if (item.category?.image) {
          const categoryImagesDir = path.join(app.getPath('userData'), 'images/categories')
          item.category.imageUrl = path.join(categoryImagesDir, item.category.image)
        }

        // Add brand image URL
        if (item.brand?.image) {
          const brandImagesDir = path.join(app.getPath('userData'), 'images/brands')
          item.brand.imageUrl = path.join(brandImagesDir, item.brand.image)
        }

        return item
      })

      return { success: true, products: plainProducts }
    } catch (err) {
      console.error('Get products error:', err)
      return { success: false, error: err.message }
    }
  },

  /* =======================================================
   GET LOW STOCK PRODUCTS
=========================================================*/
  async getLowStockProducts() {
    try {
      const products = await Product.findAll({
        where: {
          opening_stock: {
            [Op.lte]: db.sequelize.col('min_stock_level')
          },
          status: 'active'
        },
        include: [
          { model: Category, as: 'category', attributes: ['categoryName'] },
          { model: Brand, as: 'brand', attributes: ['brandName'] },
          { model: Unit, as: 'base_unit', attributes: ['unit_name', 'abbreviation'] }
        ],
        order: [['opening_stock', 'ASC']]
      })

      const plainProducts = products.map(product => {
        const item = product.get({ plain: true })
        item.imageUrl = this.getFullImagePath(item.image)
        return item
      })

      return { success: true, products: plainProducts, count: plainProducts.length }
    } catch (err) {
      console.error('Get low stock products error:', err)
      return { success: false, error: err.message }
    }
  },

  /* =======================================================
   BULK DELETE PRODUCTS
=========================================================*/
  async bulkDeleteProducts(ids) {
    try {
      if (!Array.isArray(ids) || ids.length === 0) {
        return { success: false, error: 'Product IDs array is required' }
      }

      await Product.destroy({ where: { id: ids } })

      return {
        success: true,
        message: `${ids.length} products deleted successfully`
      }
    } catch (err) {
      console.error('Bulk delete products error:', err)
      return { success: false, error: err.message }
    }
  },

  /* =======================================================
   UPDATE PRODUCT STOCK
=========================================================*/
  async updateProductStock(id, quantity, operation = 'add') {
    try {
      const product = await Product.findByPk(id)
      if (!product) {
        return { success: false, error: 'Product not found' }
      }

      let newStock = product.opening_stock

      if (operation === 'add') {
        newStock += quantity
      } else if (operation === 'subtract') {
        newStock -= quantity
        if (newStock < 0) {
          return { success: false, error: 'Insufficient stock' }
        }
      } else {
        newStock = quantity // direct set
      }

      await product.update({ opening_stock: newStock })

      return { success: true, product, newStock }
    } catch (err) {
      console.error('Update stock error:', err)
      return { success: false, error: err.message }
    }
  }
}