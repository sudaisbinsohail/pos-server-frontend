const db = require('../models')
const { Category } = db
const fs = require('fs')
const path = require('path')
const { app } = require('electron')

module.exports = {
  saveImageLocallyUsingUUID(filePath, uuid) {
    if (!filePath) return null

    const imagesDir = path.join(app.getPath('userData'), 'images/categories')
    if (!fs.existsSync(imagesDir)) fs.mkdirSync(imagesDir, { recursive: true })

    // keep extension from original file
    const ext = path.extname(filePath)
    const finalName = `${uuid}${ext}`

    const destPath = path.join(imagesDir, finalName)

    fs.copyFileSync(filePath, destPath)

    // store only the filename in DB
    return finalName
  },

  getFullImagePath(fileName) {
    if (!fileName) return null

    const imagesDir = path.join(app.getPath('userData'), 'images/categories')
    console.log('get full path', path.join(imagesDir, fileName))
    return path.join(imagesDir, fileName)
  },

  deleteImage(filename) {
    try {
      const filePath = path.join(app.getPath('userData'), 'images/categories', filename)
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath)
      }
    } catch (err) {
      console.error('Error deleting image:', err)
    }
  },

  async createCategory(data) {
    try {
      // Step 1: create category first (no image)
      console.log(data)
      const category = await Category.create({
        categoryName: data.categoryName,
        slug: data.slug || null,
        parentId: data.parentId || null,
        image: null, // temporarily empty
        status: data.status !== undefined ? data.status : true,
        sortOrder: data.sortOrder || 0,
        user_id: data.user_id
      })

      // Step 2: If image provided → save using DB UUID
      if (data.image) {
        const newImageName = this.saveImageLocallyUsingUUID(
          data.image,
          category.uuid // <-- UUID from DB
        )

        // Step 3: Update category with image filename
        await category.update({ image: newImageName })
      }

      return { success: true, category }
    } catch (err) {
      console.error('Create category error:', err)
      return { success: false, error: err.message }
    }
  },

  // -------------------------
  // UPDATE CATEGORY
  // -------------------------

  async updateCategory(id, data) {
    try {
      console.log('in cotroller')
      // Step 1: Find category
      const category = await Category.findByPk(id)
      if (!category) {
        return { success: false, error: 'Category not found' }
      }

      // Step 2: Update basic fields first
      await category.update({
        categoryName: data.categoryName ?? category.categoryName,
        slug: data.slug ?? category.slug,
        parentId: data.parentId ?? category.parentId,
        status: data.status !== undefined ? data.status : category.status,
        sortOrder: data.sortOrder ?? category.sortOrder
      })

      // Step 3: If new image provided → replace old image
      if (data.image) {
        // delete old image if exists
        if (category.image) {
          this.deleteImage(category.image)
        }

        // Save new image using UUID as filename
        const newImageName = this.saveImageLocallyUsingUUID(
          data.image,
          category.uuid // same UUID as during creation
        )

        // Update the record with new image filename
        await category.update({ image: newImageName })
      }

      return { success: true, category }
    } catch (err) {
      console.error('Update category error:', err)
      return { success: false, error: err.message }
    }
  },

  // -------------------------
  // DELETE CATEGORY (Soft Delete)
  // -------------------------
  async deleteCategory(id) {
    try {
      console.log('This is id', id)
      const category = await Category.findByPk(id)
      if (!category) {
        return { success: false, error: 'Category not found' }
      }

      await category.destroy() // soft delete if paranoid: true in model
      return { success: true }
    } catch (err) {
      console.error('Delete category error:', err)
      return { success: false, error: err.message }
    }
  },

  // -------------------------
  // GET CATEGORY BY ID
  // -------------------------
  async getCategoryById(categoryId) {
    try {
      const category = await Category.findByPk(categoryId, {
        include: [
          { model: Category, as: 'subCategories' },
          { model: Category, as: 'parentCategory' }
        ]
      })

      if (!category) {
        return { success: false, error: 'Category not found' }
      }

      const plain = category.get({ plain: true })

      // Add full path for main image
      plain.imageUrl = this.getFullImagePath(plain.image)

      // Add full path for parent image
      if (plain.parent) {
        plain.parent.imageUrl = this.getFullImagePath(plain.parent.image)
      }

      // Add full path for each child image
      if (plain.children?.length) {
        plain.children = plain.children.map((c) => ({
          ...c,
          imageUrl: this.getFullImagePath(c.image)
        }))
      }

      return { success: true, category: plain }
    } catch (err) {
      console.error('Get category error:', err)
      return { success: false, error: err.message }
    }
  },

  // async getCategories(parentId = null) {
  //   try {
  //     const whereClause = { parentId }

  //     const categories = await Category.findAll({
  //       where: whereClause,
  //       include: [{ model: Category, as: 'subCategories' }],
  //       order: [
  //         ['sortOrder', 'ASC'],
  //         ['categoryName', 'ASC']
  //       ]
  //     })

  //     const plainCategories = categories.map((cat) => {
  //       const item = cat.get({ plain: true })

  //       // category image
  //       item.imageUrl = this.getFullImagePath(item.image)
  //       // console.log(item.children)

  //       // child images
  //       if (item.subCategories?.length) {
  //       item.subCategories = item.subCategories.map((child) => ({
  //         ...child,
  //         imageUrl: this.getFullImagePath(child.image)
  //       }));
  //     }

  //       return item
  //     })

  //     return { success: true, categories: plainCategories }
  //   } catch (err) {
  //     console.error('Get categories error:', err)
  //     return { success: false, error: err.message }
  //   }
  // },
  



  async getCategories(parentId = null) {
  try {
    // fetch categories for this level
    const categories = await Category.findAll({
      where: { parentId },
      order: [
        ['sortOrder', 'ASC'],
        ['categoryName', 'ASC']
      ]
    });

    const plainCategories = await Promise.all(
      categories.map(async (cat) => {
        const item = cat.get({ plain: true });
        item.imageUrl = this.getFullImagePath(item.image);

        // recursively get subcategories
        const subResult = await this.getCategories(item.id);
        item.subCategories = subResult.success ? subResult.categories : [];

        // add images to child categories already done recursively
        return item;
      })
    );

    return { success: true, categories: plainCategories };
  } catch (err) {
    console.error('Get categories error:', err);
    return { success: false, error: err.message };
  }
},
  async getCategoriesTree(parentId = null) {
    try {
      const categories = await Category.findAll({
        where: { parentId },
        order: [
          ['sortOrder', 'ASC'],
          ['categoryName', 'ASC']
        ]
      });

      const result = [];

      for (const cat of categories) {
        const item = cat.get({ plain: true });

        // ✅ Recursively fetch children as array
        item.subCategories = await this.getCategoriesTree(item.id);

        // Only keep fields dropdown needs (optional)
        result.push({
          id: item.id,
          categoryName: item.categoryName,
          parentId: item.parentId,
          subCategories: item.subCategories
        });
      }

      return result; // return **array**, not {success: true, categories: ...}
    } catch (err) {
      console.error('Error fetching categories:', err);
      return [];
    }
  }


}
