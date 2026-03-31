import { ipcMain } from "electron";
const customerController = require('../../controllers/customerController')

export default function customerIPC() {
ipcMain.handle('create-customer', async (event, data) => {
  return await customerController.createCustomer(data)
})

ipcMain.handle('update-customer', async (event, id, data) => {
  return await customerController.updateCustomer(id, data)
})

ipcMain.handle('delete-customer', async (event, id) => {
  return await customerController.deleteCustomer(id)
})

ipcMain.handle('get-customer', async (event, id) => {
  return await customerController.getCustomerById(id)
})

ipcMain.handle('list-customers', async (event, filters) => {
  return await customerController.getCustomers(filters)
})
}
