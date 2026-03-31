// const db = require('../models')
// const { Sale, SaleItem, Customer, Product, Unit, User } = db
// const { Op } = require('sequelize')

// module.exports = {
//   /* =======================================================
//    GENERATE INVOICE NUMBER
//   =========================================================*/
//   async generateInvoiceNumber() {
//     const today = new Date()
//     const year = today.getFullYear()
//     const month = String(today.getMonth() + 1).padStart(2, '0')
//     const day = String(today.getDate()).padStart(2, '0')
    
//     const prefix = `INV-${year}${month}${day}`
    
//     const lastSale = await Sale.findOne({
//       where: {
//         invoice_number: {
//           [Op.like]: `${prefix}%`
//         }
//       },
//       order: [['invoice_number', 'DESC']],
//        paranoid: false 
//     })
    
//     let sequence = 1
//     if (lastSale) {
//       const lastNumber = lastSale.invoice_number.split('-').pop()
//       sequence = parseInt(lastNumber) + 1
//     }
    
//     return `${prefix}-${String(sequence).padStart(4, '0')}`
//   },

//   /* =======================================================
//    CREATE SALE
//   =========================================================*/
//   async createSale(data) {
//     const transaction = await Sale.sequelize.transaction()
    
//     try {
//       // Generate invoice number
//       const invoice_number = await this.generateInvoiceNumber()

//       // Create sale
//       const sale = await Sale.create({
//         invoice_number,
//         customer_id: data.customer_id || null,
//         user_id: data.user_id,
//         sale_date: data.sale_date || new Date(),
//         subtotal: data.subtotal,
//         tax_amount: data.tax_amount,
//         discount_amount: data.discount_amount,
//         total_amount: data.total_amount,
//         paid_amount: data.paid_amount,
//         change_amount: data.change_amount,
//         payment_method: data.payment_method,
//         payment_status: data.payment_status,
//         sale_status: data.sale_status || 'completed',
//         notes: data.notes || null
//       }, { transaction })

//       // Create sale items
//       if (data.items && data.items.length > 0) {
//         for (const item of data.items) {
//           await SaleItem.create({
//             sale_id: sale.id,
//             product_id: item.product_id,
//             unit_id: item.unit_id || null,
//             product_name: item.product_name,
//             quantity: item.quantity,
//             unit_price: item.unit_price,
//             tax_percent: item.tax_percent || 0,
//             tax_amount: item.tax_amount || 0,
//             discount_percent: item.discount_percent || 0,
//             discount_amount: item.discount_amount || 0,
//             subtotal: item.subtotal,
//             total: item.total
//           }, { transaction })

//           // Update product stock
//           const product = await Product.findByPk(item.product_id, { transaction })
//           if (product) {
//             const newStock = parseFloat(product.opening_stock) - parseFloat(item.quantity)
//             await product.update({ opening_stock: newStock }, { transaction })
//           }
//         }
//       }

//       // Update customer balance if exists
//       if (data.customer_id && data.payment_status !== 'paid') {
//         const customer = await Customer.findByPk(data.customer_id, { transaction })
//         if (customer) {
//           const remainingAmount = parseFloat(data.total_amount) - parseFloat(data.paid_amount)
//           const newBalance = parseFloat(customer.balance) + remainingAmount
//           await customer.update({ balance: newBalance }, { transaction })
//         }
//       }

//       await transaction.commit()

//       return { success: true, sale, invoice_number }
//     } catch (err) {
//       await transaction.rollback()
//       console.error('Create sale error:', err)
//       return { success: false, error: err.message }
//     }
//   },

//   /* =======================================================
//    GET SALE BY ID
//   =========================================================*/
//   async getSaleById(id) {
//     try {
//       const sale = await Sale.findByPk(id, {
//         include: [
//           {
//             model: Customer,
//             as: 'customer',
//             attributes: ['id', 'customerName', 'mobile', 'email']
//           },
//           {
//             model: User,
//             as: 'cashier',
//             attributes: ['id', 'name', 'email']
//           },
//           {
//             model: SaleItem,
//             as: 'items',
//             include: [
//               {
//                 model: Product,
//                 as: 'product',
//                 attributes: ['id', 'name', 'sku']
//               },
//               {
//                 model: Unit,
//                 as: 'unit',
//                 attributes: ['id', 'unit_name', 'abbreviation']
//               }
//             ]
//           }
//         ]
//       })

//       if (!sale) {
//         return { success: false, error: 'Sale not found' }
//       }

//       return { success: true, sale: sale.get({ plain: true }) }
//     } catch (err) {
//       console.error('Get sale error:', err)
//       return { success: false, error: err.message }
//     }
//   },

//   /* =======================================================
//    GET ALL SALES
//   =========================================================*/
//   async getSales(filters = {}) {
//     try {
//       const { search, start_date, end_date, payment_status, customer_id } = filters
//       const whereClause = {}

//       // Search by invoice number
//       if (search) {
//         whereClause.invoice_number = { [Op.like]: `%${search}%` }
//       }

//       // Filter by date range
//       if (start_date && end_date) {
//         whereClause.sale_date = {
//           [Op.between]: [new Date(start_date), new Date(end_date)]
//         }
//       }

//       // Filter by payment status
//       if (payment_status && payment_status !== 'all') {
//         whereClause.payment_status = payment_status
//       }

//       // Filter by customer
//       if (customer_id) {
//         whereClause.customer_id = customer_id
//       }

//       const sales = await Sale.findAll({
//         where: whereClause,
//         include: [
//           {
//             model: Customer,
//             as: 'customer',
//             attributes: ['id', 'customerName', 'mobile']
//           },
//           {
//             model: User,
//             as: 'cashier',
//             attributes: ['id', 'name']
//           }
//         ],
//         order: [['sale_date', 'DESC']]
//       })

//       return { success: true, sales: sales.map(s => s.get({ plain: true })) }
//     } catch (err) {
//       console.error('Get sales error:', err)
//       return { success: false, error: err.message }
//     }
//   },

//   /* =======================================================
//    DELETE SALE
//   =========================================================*/
//   async deleteSale(id) {
//     const transaction = await Sale.sequelize.transaction()
    
//     try {
//       const sale = await Sale.findByPk(id, {
//         include: [{ model: SaleItem, as: 'items' }]
//       })

//       if (!sale) {
//         return { success: false, error: 'Sale not found' }
//       }

//       // Restore product stock
//       for (const item of sale.items) {
//         const product = await Product.findByPk(item.product_id, { transaction })
//         if (product) {
//           const newStock = parseFloat(product.opening_stock) + parseFloat(item.quantity)
//           await product.update({ opening_stock: newStock }, { transaction })
//         }
//       }

//       // Delete sale items
//       await SaleItem.destroy({
//         where: { sale_id: id },
//         force: true,
//         transaction
//       })

//       // Delete sale
//       await sale.destroy({ transaction })

//       await transaction.commit()
//       return { success: true }
//     } catch (err) {
//       await transaction.rollback()
//       console.error('Delete sale error:', err)
//       return { success: false, error: err.message }
//     }
//   },

//   /* =======================================================
//    GET SALES STATS
//   =========================================================*/
//   async getSalesStats(filters = {}) {
//     try {
//       const { start_date, end_date } = filters
//       const whereClause = {}

//       if (start_date && end_date) {
//         whereClause.sale_date = {
//           [Op.between]: [new Date(start_date), new Date(end_date)]
//         }
//       }

//       const stats = await Sale.findAll({
//         where: whereClause,
//         attributes: [
//           [db.sequelize.fn('COUNT', db.sequelize.col('id')), 'total_sales'],
//           [db.sequelize.fn('SUM', db.sequelize.col('total_amount')), 'total_revenue'],
//           [db.sequelize.fn('SUM', db.sequelize.col('paid_amount')), 'total_paid'],
//           [db.sequelize.fn('AVG', db.sequelize.col('total_amount')), 'average_sale']
//         ]
//       })

//       return { success: true, stats: stats[0] }
//     } catch (err) {
//       console.error('Get sales stats error:', err)
//       return { success: false, error: err.message }
//     }
//   }
// }






const db = require('../models')
const { Sale, SaleItem, Customer, Product, Unit, User } = db
const { Op } = require('sequelize')

module.exports = {
  /* =======================================================
   GENERATE INVOICE NUMBER
  =========================================================*/
  async generateInvoiceNumber() {
    const today = new Date()
    const year = today.getFullYear()
    const month = String(today.getMonth() + 1).padStart(2, '0')
    const day = String(today.getDate()).padStart(2, '0')
    
    const prefix = `INV-${year}${month}${day}`
    
    const lastSale = await Sale.findOne({
      where: {
        invoice_number: {
          [Op.like]: `${prefix}%`
        }
      },
      order: [['invoice_number', 'DESC']],
       paranoid: false 
    })
    
    let sequence = 1
    if (lastSale) {
      const lastNumber = lastSale.invoice_number.split('-').pop()
      sequence = parseInt(lastNumber) + 1
    }
    
    return `${prefix}-${String(sequence).padStart(4, '0')}`
  },

  /* =======================================================
   CREATE SALE
  =========================================================*/
  async createSale(data) {
    const transaction = await Sale.sequelize.transaction()
    
    try {
      // Generate invoice number
      const invoice_number = await this.generateInvoiceNumber()

      // Create sale
      const sale = await Sale.create({
        invoice_number,
        customer_id: data.customer_id || null,
        user_id: data.user_id,
        sale_date: data.sale_date || new Date(),
        subtotal: data.subtotal,
        tax_amount: data.tax_amount,
        discount_amount: data.discount_amount,
        total_amount: data.total_amount,
        paid_amount: data.paid_amount,
        change_amount: data.change_amount,
        payment_method: data.payment_method,
        payment_status: data.payment_status,
        sale_status: data.sale_status || 'completed',
        notes: data.notes || null
      }, { transaction })

      // Create sale items
      if (data.items && data.items.length > 0) {
        for (const item of data.items) {
          await SaleItem.create({
            sale_id: sale.id,
            product_id: item.product_id,
            unit_id: item.unit_id || null,
            product_name: item.product_name,
            quantity: item.quantity,
            unit_price: item.unit_price,
            tax_percent: item.tax_percent || 0,
            tax_amount: item.tax_amount || 0,
            discount_percent: item.discount_percent || 0,
            discount_amount: item.discount_amount || 0,
            subtotal: item.subtotal,
            total: item.total
          }, { transaction })

          // Update product stock
          const product = await Product.findByPk(item.product_id, { transaction })
          if (product) {
            const newStock = parseFloat(product.opening_stock) - parseFloat(item.quantity)
            await product.update({ opening_stock: newStock }, { transaction })
          }
        }
      }

      // Update customer balance if exists
      if (data.customer_id && data.payment_status !== 'paid') {
        const customer = await Customer.findByPk(data.customer_id, { transaction })
        if (customer) {
          const remainingAmount = parseFloat(data.total_amount) - parseFloat(data.paid_amount)
          const newBalance = parseFloat(customer.balance) + remainingAmount
          await customer.update({ balance: newBalance }, { transaction })
        }
      }

      await transaction.commit()

      return { success: true, sale, invoice_number }
    } catch (err) {
      await transaction.rollback()
      console.error('Create sale error:', err)
      return { success: false, error: err.message }
    }
  },

  /* =======================================================
   GET SALE BY ID
  =========================================================*/
  async getSaleById(id) {
    try {
      const sale = await Sale.findByPk(id, {
        include: [
          {
            model: Customer,
            as: 'customer',
            attributes: ['id', 'customerName', 'mobile', 'email']
          },
          {
            model: User,
            as: 'cashier',
            attributes: ['id', 'name', 'email']
          },
          {
            model: SaleItem,
            as: 'items',
            include: [
              {
                model: Product,
                as: 'product',
                attributes: ['id', 'name', 'sku']
              },
              {
                model: Unit,
                as: 'unit',
                attributes: ['id', 'unit_name', 'abbreviation']
              }
            ]
          }
        ]
      })

      if (!sale) {
        return { success: false, error: 'Sale not found' }
      }

      return { success: true, sale: sale.get({ plain: true }) }
    } catch (err) {
      console.error('Get sale error:', err)
      return { success: false, error: err.message }
    }
  },

  /* =======================================================
   GET ALL SALES
  =========================================================*/
  async getSales(filters = {}) {
    try {
      const { search, start_date, end_date, payment_status, customer_id } = filters
      const whereClause = {}

      // Search by invoice number
      if (search) {
        whereClause.invoice_number = { [Op.like]: `%${search}%` }
      }

      // Filter by date range
      if (start_date && end_date) {
        whereClause.sale_date = {
          [Op.between]: [new Date(start_date), new Date(end_date)]
        }
      }

      // Filter by payment status
      if (payment_status && payment_status !== 'all') {
        whereClause.payment_status = payment_status
      }

      // Filter by customer
      if (customer_id) {
        whereClause.customer_id = customer_id
      }

      const sales = await Sale.findAll({
        where: whereClause,
        include: [
          {
            model: Customer,
            as: 'customer',
            attributes: ['id', 'customerName', 'mobile']
          },
          {
            model: User,
            as: 'cashier',
            attributes: ['id', 'name']
          }
        ],
        order: [['sale_date', 'DESC']]
      })

      return { success: true, sales: sales.map(s => s.get({ plain: true })) }
    } catch (err) {
      console.error('Get sales error:', err)
      return { success: false, error: err.message }
    }
  },

  /* =======================================================
   DELETE SALE
  =========================================================*/
  async deleteSale(id) {
    const transaction = await Sale.sequelize.transaction()
    
    try {
      const sale = await Sale.findByPk(id, {
        include: [{ model: SaleItem, as: 'items' }]
      })

      if (!sale) {
        return { success: false, error: 'Sale not found' }
      }

      // Restore product stock
      for (const item of sale.items) {
        const product = await Product.findByPk(item.product_id, { transaction })
        if (product) {
          const newStock = parseFloat(product.opening_stock) + parseFloat(item.quantity)
          await product.update({ opening_stock: newStock }, { transaction })
        }
      }

      // Delete sale items
      await SaleItem.destroy({
        where: { sale_id: id },
        force: true,
        transaction
      })

      // Delete sale
      await sale.destroy({ transaction })

      await transaction.commit()
      return { success: true }
    } catch (err) {
      await transaction.rollback()
      console.error('Delete sale error:', err)
      return { success: false, error: err.message }
    }
  },

  /* =======================================================
   GET SALES STATS (ENHANCED WITH PROFIT METRICS)
  =========================================================*/
  async getSalesStats(filters = {}) {
    try {
      const { start_date, end_date } = filters
      const whereClause = {}

      if (start_date && end_date) {
        whereClause.sale_date = {
          [Op.between]: [new Date(start_date), new Date(end_date)]
        }
      }

      // Get basic sales stats
      const stats = await Sale.findAll({
        where: whereClause,
        attributes: [
          [db.sequelize.fn('COUNT', db.sequelize.col('Sale.id')), 'total_sales'],
          [db.sequelize.fn('SUM', db.sequelize.col('total_amount')), 'total_revenue'],
          [db.sequelize.fn('SUM', db.sequelize.col('paid_amount')), 'total_paid'],
          [db.sequelize.fn('AVG', db.sequelize.col('total_amount')), 'average_sale']
        ]
      })

      // Calculate profit metrics by getting all sales with items
      const salesWithItems = await Sale.findAll({
        where: whereClause,
        include: [
          {
            model: SaleItem,
            as: 'items',
            include: [
              {
                model: Product,
                as: 'product',
                attributes: ['id', 'buying_price', 'selling_price']
              }
            ]
          }
        ]
      })

      let totalPurchaseCost = 0
      let totalSalePrice = 0

      salesWithItems.forEach(sale => {
        sale.items.forEach(item => {
          const quantity = parseFloat(item.quantity)
          const buyingPrice = parseFloat(item.product?.buying_price || 0)
          const sellingPrice = parseFloat(item.unit_price)

          totalPurchaseCost += quantity * buyingPrice
          totalSalePrice += quantity * sellingPrice
        })
      })

      // Combine all stats
      const result = {
        ...stats[0].get({ plain: true }),
        total_purchase_cost: totalPurchaseCost,
        total_sale_price: totalSalePrice,
        expected_profit: totalSalePrice - totalPurchaseCost,
        profit_margin: totalSalePrice > 0 ? ((totalSalePrice - totalPurchaseCost) / totalSalePrice * 100) : 0
      }

      return { success: true, stats: result }
    } catch (err) {
      console.error('Get sales stats error:', err)
      return { success: false, error: err.message }
    }
  }
}