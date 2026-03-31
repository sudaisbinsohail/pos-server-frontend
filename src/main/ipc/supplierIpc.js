import { ipcMain } from "electron";
const supplierController = require('../../controllers/supplierController')

export default function supplierIPC() {
  ipcMain.handle("supplier:create", (e, data) =>
    supplierController.createSupplier(data)
  );

  ipcMain.handle("supplier:update", (e, id, data) =>
    supplierController.updateSupplier(id, data)
  );

  ipcMain.handle("supplier:delete", (e, id) =>
    supplierController.deleteSupplier(id)
  );

  ipcMain.handle("supplier:get", (e, id) =>
    supplierController.getSupplierById(id)
  );

  ipcMain.handle("supplier:list", (e, filters) =>
    supplierController.getSuppliers(filters)
  );
}
