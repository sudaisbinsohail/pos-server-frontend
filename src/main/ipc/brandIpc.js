import { ipcMain } from "electron";
const brandController = require('../../controllers/brandController')

export default function brandIPC() {
  ipcMain.handle("brand:create", (e, data) =>
    brandController.createBrand(data)
  );

  ipcMain.handle("brand:getBrands", () =>
    brandController.getBrands()
  );

  ipcMain.handle("brand:getById", (e, id) =>
    brandController.getBrandById(id)
  );

  ipcMain.handle("brand:update", (e, id, data) =>
    brandController.updateBrand(id, data)
  );

  ipcMain.handle("brand:delete", (e, id) =>
    brandController.deleteBrand(id)
  );
}
