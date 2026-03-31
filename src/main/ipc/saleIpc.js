import { ipcMain } from "electron";
const saleController = require('../../controllers/saleController')

export default function saleIPC() {
ipcMain.handle('create-sale', async (event, data) => {
  return await saleController.createSale(data)
})

ipcMain.handle('get-sale', async (event, id) => {
  return await saleController.getSaleById(id)
})

ipcMain.handle('list-sales', async (event, filters) => {
  return await saleController.getSales(filters)
})

ipcMain.handle('delete-sale', async (event, id) => {
  return await saleController.deleteSale(id)
})

ipcMain.handle('get-sales-stats', async (event, filters) => {
  return await saleController.getSalesStats(filters)
})
}
