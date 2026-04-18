import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {
  checkCompany: () => ipcRenderer.invoke('check:company'),
  getCompany: (id) => ipcRenderer.invoke('company:get', id),
  updateCompany: (id,data) => ipcRenderer.invoke('company:update', id,data),


  checkAdmin: () => ipcRenderer.invoke('check:admin'),
  createUser: (data) => ipcRenderer.invoke('user:create', data),
  createCompany: (data) => ipcRenderer.invoke('company:create', data),
  listUsers: (filter) => ipcRenderer.invoke('user:list', filter),
  authUser: (email, password) => ipcRenderer.invoke('user:auth', email, password),
  userSession: (user) => ipcRenderer.invoke('user:session', user),
  getUserSession: () => ipcRenderer.invoke('user:getSession'),
  removeUserSession: () => ipcRenderer.invoke('user:removeSession'),
  softDeleteUser: (id) => ipcRenderer.invoke('user:softDelete', id),
  updateUser: (id, data) => ipcRenderer.invoke('user:update', id, data),
  createCategory: (data) => ipcRenderer.invoke('category:create', data),
  getCategories: (id) => ipcRenderer.invoke('category:getCategories', id),
  
  getCategoriesTree: (id) => ipcRenderer.invoke('category:getCategoriesTree', id),
  updateCategory: (id, data) => ipcRenderer.invoke('category:update', id, data),
  deleteCategory: (id) => ipcRenderer.invoke('category:delete', id),
  selectImageFile: () => ipcRenderer.invoke('select-image-file'),
  readImageBase64: (filePath) => ipcRenderer.invoke('read-image-base64', filePath),
  createBrand: (data) => ipcRenderer.invoke('brand:create', data),
  getBrands: () => ipcRenderer.invoke('brand:getBrands'),
  getBrandById: (id) => ipcRenderer.invoke('brand:getById', id),
  updateBrand: (id, data) => ipcRenderer.invoke('brand:update', id, data),
  deleteBrand: (id) => ipcRenderer.invoke('brand:delete', id),
  createSupplier: (data) => ipcRenderer.invoke('supplier:create', data),
  updateSupplier: (id, data) => ipcRenderer.invoke('supplier:update', id, data),
  deleteSupplier: (id) => ipcRenderer.invoke('supplier:delete', id),
  getSupplier: (id) => ipcRenderer.invoke('supplier:get', id),
  listSuppliers: (filters) => ipcRenderer.invoke('supplier:list', filters),
  
  createUnit: (data) => ipcRenderer.invoke('unit:create', data),
  listUnits: (filters) => ipcRenderer.invoke('unit:list', filters),
  getUnit: (id) => ipcRenderer.invoke('unit:get', id),
  updateUnit: (id, data) => ipcRenderer.invoke('unit:update', id, data),
  softDeleteUnit: (id) => ipcRenderer.invoke('unit:softDelete', id),
  restoreUnit: (id) => ipcRenderer.invoke('unit:restore', id),
  sortUnits: (sortedIds) => ipcRenderer.invoke("unit:sort", sortedIds),


   // Add to api object:
createProduct: (data) => ipcRenderer.invoke('product:create', data),
getProducts: (filters) => ipcRenderer.invoke('product:getAll', filters),
getProductById: (id) => ipcRenderer.invoke('product:getById', id),
updateProduct: (id, data) => ipcRenderer.invoke('product:update', id, data),
deleteProduct: (id) => ipcRenderer.invoke('product:delete', id),
restoreProduct: (id) => ipcRenderer.invoke('product:restore', id),
bulkDeleteProducts: (ids) => ipcRenderer.invoke('product:bulkDelete', ids),
getLowStockProducts: () => ipcRenderer.invoke('product:getLowStock'),
updateProductStock: (id, quantity, operation) => ipcRenderer.invoke('product:updateStock', id, quantity, operation),
getProductImagePath: (fileName) => ipcRenderer.invoke('product:getImagePath', fileName),




// Customer APIs
createCustomer: (data) => ipcRenderer.invoke('create-customer', data),
updateCustomer: (id, data) => ipcRenderer.invoke('update-customer', id, data),
deleteCustomer: (id) => ipcRenderer.invoke('delete-customer', id),
getCustomerById: (id) => ipcRenderer.invoke('get-customer', id),
listCustomers: (filters) => ipcRenderer.invoke('list-customers', filters),

// Sale APIs
createSale: (data) => ipcRenderer.invoke('create-sale', data),
getSaleById: (id) => ipcRenderer.invoke('get-sale', id),
listSales: (filters) => ipcRenderer.invoke('list-sales', filters),
deleteSale: (id) => ipcRenderer.invoke('delete-sale', id),
getSalesStats: (filters) => ipcRenderer.invoke('get-sales-stats', filters),


 // Role APIs
  createRole: (data) => ipcRenderer.invoke('role:create', data),
  updateRole: (id, data) => ipcRenderer.invoke('role:update', id, data),
  deleteRole: (id) => ipcRenderer.invoke('role:delete', id),
  getRoleById: (id) => ipcRenderer.invoke('role:getById', id),
  getRoles: (filters) => ipcRenderer.invoke('role:getAll', filters),
  assignPermissions: (roleId, permissionIds) => ipcRenderer.invoke('role:assignPermissions', roleId, permissionIds),
  checkPermission: (userId, permissionSlug) => ipcRenderer.invoke('role:checkPermission', userId, permissionSlug),
  getUserPermissions: (userId) => ipcRenderer.invoke('role:getUserPermissions', userId),

  // Permission APIs
  createPermission: (data) => ipcRenderer.invoke('permission:create', data),
  updatePermission: (id, data) => ipcRenderer.invoke('permission:update', id, data),
  deletePermission: (id) => ipcRenderer.invoke('permission:delete', id),
  getPermissionById: (id) => ipcRenderer.invoke('permission:getById', id),
  getPermissions: () => ipcRenderer.invoke('permission:getAll'),
  getPermissionsGrouped: () => ipcRenderer.invoke('permission:getGrouped'),
  seedPermissions: () => ipcRenderer.invoke('permission:seed'),


 printReceipt: (html) => ipcRenderer.send('print-receipt', html),


}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  window.electron = electronAPI
  window.api = api
}
