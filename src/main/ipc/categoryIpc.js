import { ipcMain } from "electron";
const categoryController = require('../../controllers/categoryController')

export default function categoryIPC() {
  ipcMain.handle("category:create", (e, data) =>
    categoryController.createCategory(data)
  );

  ipcMain.handle("category:getCategories", (e, id) =>
    categoryController.getCategories(id)
  ); 
  
  
  ipcMain.handle("category:getCategoriesTree", (e, id) =>
    categoryController.getCategoriesTree(id)
  );

  ipcMain.handle("category:update", (e, id, data) =>
    categoryController.updateCategory(id, data)
  );

  ipcMain.handle("category:delete", (e, id) =>
    categoryController.deleteCategory(id)
  );
}
