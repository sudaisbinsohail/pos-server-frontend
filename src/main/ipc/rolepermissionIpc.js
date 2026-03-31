import { ipcMain } from "electron";
const roleController = require('../../controllers/roleController')
const permissionController = require('../../controllers/permissionController')

export default function rolePermissionIPC() {
  // ================== ROLE HANDLERS ==================
  
  ipcMain.handle('role:create', async (event, data) => {
    return await roleController.createRole(data)
  })

  ipcMain.handle('role:update', async (event, id, data) => {
    return await roleController.updateRole(id, data)
  })

  ipcMain.handle('role:delete', async (event, id) => {
    return await roleController.deleteRole(id)
  })

  ipcMain.handle('role:getById', async (event, id) => {
    return await roleController.getRoleById(id)
  })

  ipcMain.handle('role:getAll', async (event, filters) => {
    return await roleController.getRoles(filters)
  })

  ipcMain.handle('role:assignPermissions', async (event, roleId, permissionIds) => {
    return await roleController.assignPermissions(roleId, permissionIds)
  })

  ipcMain.handle('role:checkPermission', async (event, userId, permissionSlug) => {
    return await roleController.checkPermission(userId, permissionSlug)
  })

  ipcMain.handle('role:getUserPermissions', async (event, userId) => {
    return await roleController.getUserPermissions(userId)
  })



  // ================== PERMISSION HANDLERS ==================
  
  ipcMain.handle('permission:create', async (event, data) => {
    return await permissionController.createPermission(data)
  })

  ipcMain.handle('permission:update', async (event, id, data) => {
    return await permissionController.updatePermission(id, data)
  })

  ipcMain.handle('permission:delete', async (event, id) => {
    return await permissionController.deletePermission(id)
  })

  ipcMain.handle('permission:getById', async (event, id) => {
    return await permissionController.getPermissionById(id)
  })

  ipcMain.handle('permission:getAll', async (event, filters) => {
    return await permissionController.getPermissions(filters)
  })

  ipcMain.handle('permission:getGrouped', async (event) => {
    return await permissionController.getPermissionsGroupedByModule()
  })

  ipcMain.handle('permission:seed', async (event) => {
    return await permissionController.seedDefaultPermissions()
  })
}