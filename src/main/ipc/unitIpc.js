import { ipcMain } from "electron";
const unitController = require("../../controllers/unitController");

export default function unitIPC() {

  // Create Unit
  ipcMain.handle("unit:create", (e, data) =>
    unitController.createUnit(data)
  );

  // Get Units with filters
  ipcMain.handle("unit:list", (e, filters) =>
    unitController.getUnits(filters)
  );

  // Get Single Unit
  ipcMain.handle("unit:get", (e, id) =>
    unitController.getUnit(id)
  );

  // Update Unit
  ipcMain.handle("unit:update", (e, id, data) =>
    unitController.updateUnit(id, data)
  );

  // Soft Delete Unit
  ipcMain.handle("unit:softDelete", (e, id) =>
    unitController.softDeleteUnit(id)
  );

  // Restore Deleted Unit
  ipcMain.handle("unit:restore", (e, id) =>
    unitController.restoreUnit(id)
  );

  ipcMain.handle('unit:sort', async (event, sortedIds) =>
    unitController.sortUnits(sortedIds)
);
}
