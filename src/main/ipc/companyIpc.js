import { ipcMain } from "electron";
const companyController = require('../../controllers/companyController')

export default function companyIPC() {
  ipcMain.handle("company:create", (e, data) =>
    companyController.createCompany(data)
  );

  ipcMain.handle("check:company", () =>
    companyController.exists()
  );

  ipcMain.handle("company:get", (e, id) =>
    companyController.getCompany(id)
  );
  
  ipcMain.handle("company:update", (e, id,data) =>
    companyController.updateCompany(id , data)
  );
}
