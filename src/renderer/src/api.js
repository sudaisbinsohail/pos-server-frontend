/**
 * api.js — Central HTTP API service
 * Replaces all Electron window.api / IPC calls with REST fetch calls.
 *
 * Usage:
 *   import api from './api'
 *   const result = await api.getBrands()
 *
 * Set BASE_URL to wherever your Express server is running.
 */

const BASE_URL = import.meta.env?.VITE_API_URL || 'http://192.168.100.197:3000/api'

// ─────────────────────────────────────────────
// Token helpers  (stored in localStorage)
// ─────────────────────────────────────────────
export function getToken() {
  return localStorage.getItem('pos_token')
}
export function setToken(token) {
  localStorage.setItem('pos_token', token)
}
export function removeToken() {
  localStorage.removeItem('pos_token')
}

// ─────────────────────────────────────────────
// Core fetch wrapper
// ─────────────────────────────────────────────
async function request(method, path, body = null, isFormData = false) {
  const headers = {}

  if (!isFormData) headers['Content-Type'] = 'application/json'

  const token = getToken()
  if (token) headers['Authorization'] = `Bearer ${token}`

  const options = { method, headers }
  if (body) options.body = isFormData ? body : JSON.stringify(body)

  try {
    const res = await fetch(`${BASE_URL}${path}`, options)
    const data = await res.json()
    return data
  } catch (err) {
    return { success: false, error: err.message }
  }
}

const get  = (path)              => request('GET',    path)
const post = (path, body, fd)    => request('POST',   path, body, fd)
const put  = (path, body, fd)    => request('PUT',    path, body, fd)
const del  = (path)              => request('DELETE', path)
const patch = (path, body)       => request('PATCH',  path, body)

// ─────────────────────────────────────────────
// AUTH
// ─────────────────────────────────────────────
const auth = {
  login:          (email, password) => post('/auth/login', { email, password }),
  registerAdmin:  (data)            => post('/auth/register-admin', data),
  getProfile:     ()                => get('/auth/profile'),
  changePassword: (data)            => put('/auth/change-password', data),
}

// ─────────────────────────────────────────────
// COMPANY
// ─────────────────────────────────────────────
const company = {
  exists:         ()       => get('/company/exists'),
  getFirst:       ()       => get('/company'),
  create:         (data)   => post('/company', data),
  getById:        (id)     => get(`/company/${id}`),
  update:         (id, data) => put(`/company/${id}`, data),
}

// ─────────────────────────────────────────────
// USERS
// ─────────────────────────────────────────────
const users = {
  adminExists: ()          => get('/users/admin-exists'),
  list:        (filters)   => {
    const q = new URLSearchParams(filters || {}).toString()
    return get(`/users${q ? '?' + q : ''}`)
  },
  create:      (data)      => post('/users', data),
  getById:     (id)        => get(`/users/${id}`),
  update:      (id, data)  => put(`/users/${id}`, data),
  delete:      (id)        => del(`/users/${id}`),
}

// ─────────────────────────────────────────────
// ROLES
// ─────────────────────────────────────────────
const roles = {
  list:             (filters)             => {
    const q = new URLSearchParams(filters || {}).toString()
    return get(`/roles${q ? '?' + q : ''}`)
  },
  create:           (data)                => post('/roles', data),
  getById:          (id)                  => get(`/roles/${id}`),
  update:           (id, data)            => put(`/roles/${id}`, data),
  delete:           (id)                  => del(`/roles/${id}`),
  assignPermissions:(id, permissionIds)   => post(`/roles/${id}/permissions`, { permissionIds }),
  getUserPermissions:(userId)             => get(`/roles/${userId}/user-permissions`),
  checkPermission:  (userId, name)        => get(`/roles/check/${userId}/${name}`),
}

// ─────────────────────────────────────────────
// PERMISSIONS
// ─────────────────────────────────────────────
const permissions = {
  list:       (filters) => {
    const q = new URLSearchParams(filters || {}).toString()
    return get(`/permissions${q ? '?' + q : ''}`)
  },
  create:     (data)    => post('/permissions', data),
  grouped:    ()        => get('/permissions/grouped'),
  seed:       ()        => post('/permissions/seed'),
  getById:    (id)      => get(`/permissions/${id}`),
  update:     (id, data) => put(`/permissions/${id}`, data),
  delete:     (id)      => del(`/permissions/${id}`),
}

// ─────────────────────────────────────────────
// BRANDS
// ─────────────────────────────────────────────
const brands = {
  list:    ()          => get('/brands'),
  create:  (data)      => post('/brands', _toForm(data), true),
  getById: (id)        => get(`/brands/${id}`),
  update:  (id, data)  => put(`/brands/${id}`, _toForm(data), true),
  delete:  (id)        => del(`/brands/${id}`),
}

// ─────────────────────────────────────────────
// CATEGORIES
// ─────────────────────────────────────────────
const categories = {
  // list:    ()          => get('/categories'),
  list: (id = null) =>
  get(id ? `/categories/${id}` : '/categories'),
  tree:    ()          => get('/categories/tree'),
  create:  (data)      => post('/categories', _toForm(data), true),
  getById: (id)        => get(`/categories/${id}`),
  update:  (id, data)  => put(`/categories/${id}`, _toForm(data), true),
  delete:  (id)        => del(`/categories/${id}`),
}

// ─────────────────────────────────────────────
// UNITS
// ─────────────────────────────────────────────
const units = {
  list:    (filters) => {
    const q = new URLSearchParams(filters || {}).toString()
    return get(`/units${q ? '?' + q : ''}`)
  },
  create:  (data)           => post('/units', data),
  sort:    (sortedIds)      => post('/units/sort', { sortedIds }),
  getById: (id)             => get(`/units/${id}`),
  update:  (id, data)       => put(`/units/${id}`, data),
  delete:  (id)             => del(`/units/${id}`),
  restore: (id)             => post(`/units/${id}/restore`),
}

// ─────────────────────────────────────────────
// SUPPLIERS
// ─────────────────────────────────────────────
const suppliers = {
  list:    (filters) => {
    const q = new URLSearchParams(filters || {}).toString()
    return get(`/suppliers${q ? '?' + q : ''}`)
  },
  create:  (data)    => post('/suppliers', _toForm(data), true),
  getById: (id)      => get(`/suppliers/${id}`),
  update:  (id, data) => put(`/suppliers/${id}`, _toForm(data), true),
  delete:  (id)      => del(`/suppliers/${id}`),
}

// ─────────────────────────────────────────────
// CUSTOMERS
// ─────────────────────────────────────────────
const customers = {
  list:    (filters) => {
    const q = new URLSearchParams(filters || {}).toString()
    return get(`/customers${q ? '?' + q : ''}`)
  },
  create:  (data)    => post('/customers', _toForm(data), true),
  getById: (id)      => get(`/customers/${id}`),
  update:  (id, data) => put(`/customers/${id}`, _toForm(data), true),
  delete:  (id)      => del(`/customers/${id}`),
}

// ─────────────────────────────────────────────
// PRODUCTS
// ─────────────────────────────────────────────
const products = {
//   list:         (filters) => {
//     const q = new URLSearchParams(filters || {}).toString()
//     return get(`/products${q ? '?' + q : ''}`)
//   },
list: (filters) => {
  const cleanedFilters = Object.fromEntries(
    Object.entries(filters || {}).filter(
      ([_, value]) => value !== null && value !== undefined && value !== ""
    )
  );

  const q = new URLSearchParams(cleanedFilters).toString();
  return get(`/products${q ? '?' + q : ''}`);
},
  create:       (data)          => post('/products', _toForm(data, ['units']), true),
  lowStock:     ()              => get('/products/low-stock'),
  getById:      (id)            => get(`/products/${id}`),
  update:       (id, data)      => put(`/products/${id}`, _toForm(data, ['units']), true),
  delete:       (id)            => del(`/products/${id}`),
  updateStock:  (id, quantity, operation) => patch(`/products/${id}/stock`, { quantity, operation }),
}

// ─────────────────────────────────────────────
// SALES
// ─────────────────────────────────────────────
const sales = {
  list:    (filters) => {
    const q = new URLSearchParams(filters || {}).toString()
    return get(`/sales${q ? '?' + q : ''}`)
  },
  create:  (data)   => post('/sales', data),
  stats:   (filters) => {
    const q = new URLSearchParams(filters || {}).toString()
    return get(`/sales/stats${q ? '?' + q : ''}`)
  },
  getById: (id)     => get(`/sales/${id}`),
  delete:  (id)     => del(`/sales/${id}`),
}

// ─────────────────────────────────────────────
// Helper: Build FormData from plain object.
// jsonFields: array of keys whose values should
//             be JSON-stringified (e.g. 'units').
// imageField: key containing a File object.
// ─────────────────────────────────────────────
function _toForm(data, jsonFields = [], imageField = 'image') {
  const fd = new FormData()
  Object.entries(data || {}).forEach(([key, val]) => {
    if (val === undefined || val === null) return
    if (key === imageField && val instanceof File) {
      fd.append(key, val)
    } else if (jsonFields.includes(key)) {
      fd.append(key, JSON.stringify(val))
    } else {
      fd.append(key, val)
    }
  })
  return fd
}

// ─────────────────────────────────────────────
// Default export — mirrors the old window.api shape
// so existing slice code needs minimal changes.
// ─────────────────────────────────────────────
const api = {
  // Auth
  login:              auth.login,
  registerAdmin:      auth.registerAdmin,
  getProfile:         auth.getProfile,
  changePassword:     auth.changePassword,

  // Company
  checkCompany:       company.exists,
  getCompany:         company.getById,
  getFirstCompany:    company.getFirst,
  createCompany:      company.create,
  updateCompany:      company.update,

  // Users
  checkAdmin:         users.adminExists,
  listUsers:          users.list,
  createUser:         users.create,
  getUserById:        users.getById,
  updateUser:         users.update,
  softDeleteUser:     users.delete,

  // Roles
  getRoles:           roles.list,
  createRole:         roles.create,
  getRoleById:        roles.getById,
  updateRole:         roles.update,
  deleteRole:         roles.delete,
  assignPermissions:  roles.assignPermissions,
  getUserPermissions: roles.getUserPermissions,
  checkPermission:    roles.checkPermission,

  // Permissions
  getPermissions:         permissions.list,
  createPermission:       permissions.create,
  getPermissionsGrouped:  permissions.grouped,
  seedPermissions:        permissions.seed,
  getPermissionById:      permissions.getById,
  updatePermission:       permissions.update,
  deletePermission:       permissions.delete,

  // Brands
  getBrands:          brands.list,
  createBrand:        brands.create,
  getBrandById:       brands.getById,
  updateBrand:        (id, data) => brands.update(id, data),
  deleteBrand:        brands.delete,

  // Categories
  getCategories:      categories.list,
  getCategoriesTree:  categories.tree,
  getCategoryById:    categories.getById,
  createCategory:     categories.create,
  updateCategory:     (id, data) => categories.update(id, data),
  deleteCategory:     categories.delete,

  // Units
  listUnits:          units.list,
  createUnit:         units.create,
  sortUnits:          units.sort,
  getUnit:            units.getById,
  updateUnit:         (id, data) => units.update(id, data),
  softDeleteUnit:     units.delete,
  restoreUnit:        units.restore,

  // Suppliers
  listSuppliers:      suppliers.list,
  createSupplier:     suppliers.create,
  getSupplier:        suppliers.getById,
  updateSupplier:     (id, data) => suppliers.update(id, data),
  deleteSupplier:     suppliers.delete,

  // Customers
  listCustomers:      customers.list,
  createCustomer:     customers.create,
  getCustomerById:    customers.getById,
  updateCustomer:     (id, data) => customers.update(id, data),
  deleteCustomer:     customers.delete,

  // Products
  getProducts:        products.list,
  createProduct:      products.create,
  getLowStockProducts:products.lowStock,
  getProductById:     products.getById,
  updateProduct:      (id, data) => products.update(id, data),
  deleteProduct:      products.delete,
  updateProductStock: products.updateStock,

  // Sales
  listSales:          sales.list,
  createSale:         sales.create,
  getSalesStats:      sales.stats,
  getSaleById:        sales.getById,
  deleteSale:         sales.delete,

  // Token management (call after login)
  setToken,
  getToken,
  removeToken,
}

export default api