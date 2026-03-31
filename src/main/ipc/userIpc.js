import { ipcMain } from "electron";
const userController = require('../../controllers/userController')

export default function userIPC() {
  ipcMain.handle("user:create", (e, data) =>
    userController.createUser(data)
  );

  ipcMain.handle("user:list", (e, filters) =>
    userController.getUsers(filters)
  );

  ipcMain.handle("user:auth", (e, email, password) =>
    userController.authUser(email, password)
  );

  ipcMain.handle("user:session", (e, user) =>
    userController.userSession(user)
  );

  ipcMain.handle("user:getSession", () =>
    userController.getUserSession()
  );

  ipcMain.handle("user:removeSession", () =>
    userController.removeUserSession()
  );

  ipcMain.handle("user:update", (e, id, data) =>
    userController.updateUser(id, data)
  );

  ipcMain.handle("user:softDelete", (e, id) =>
    userController.softDeleteUser(id)
  );

  ipcMain.handle('check:admin', async () => {
  return await userController.adminExists()
})
}
