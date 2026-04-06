// 'use strict'

// const db = require('../models')
// const { Product, ProductUnit, Unit, Category, Brand, User, Role, Permission, Company, RolePermission } = db
// const { DataTypes } = require('sequelize')
// const { io } = require('socket.io-client')

// // ── SyncMeta ──────────────────────────────────────────────────────────────────
// let SyncMeta = null

// async function _initMeta() {
//   if (SyncMeta) return
//   SyncMeta = db.sequelize.define('SyncMeta', {
//     key: { type: DataTypes.STRING, primaryKey: true },
//     value: { type: DataTypes.TEXT }
//   }, { tableName: 'sync_meta', timestamps: false })
//   await SyncMeta.sync()
// }

// async function _getLastSync(key) {
//   await _initMeta()
//   const row = await SyncMeta.findByPk(key)
//   return row ? row.value : null
// }

// async function _setLastSync(key, iso) {
//   await _initMeta()
//   await SyncMeta.upsert({ key, value: iso })
// }


// let _lastFkSync = 0


// async function _pullAll() {
//   await _pullTable({ endpoint: '/api/sync/companies', metaKey: 'lastCompanySync', model: Company, label: 'Companies' })
//   await _pullTable({ endpoint: '/api/sync/permissions', metaKey: 'lastPermissionSync', model: Permission, label: 'Permissions' })
//   await _pullTable({ endpoint: '/api/sync/roles', metaKey: 'lastRoleSync', model: Role, label: 'Roles' })
//   await _pullTable({ endpoint: '/api/sync/users', metaKey: 'lastUserSync', model: User, label: 'Users' })
//   await _pullTable({ endpoint: '/api/sync/units', metaKey: 'lastUnitSync', model: Unit, label: 'Units' })
//   await _pullTable({ endpoint: '/api/sync/categories', metaKey: 'lastCategorySync', model: Category, label: 'Categories' })
//   await _pullTable({ endpoint: '/api/sync/brands', metaKey: 'lastBrandSync', model: Brand, label: 'Brands' })
//   await _pullTable({ endpoint: '/api/sync/products', metaKey: 'lastProductSync', model: Product, label: 'Products' })
//   await _pullTable({ endpoint: '/api/sync/rolepermissions', metaKey: 'lastRolePermissionSync', model: RolePermission, label: 'RolePermission' })
//   await _pullTable({ endpoint: '/api/sync/productunit', metaKey: 'lastProductUnitSync', model: ProductUnit, label: 'ProductUnit' })

//   // await _pullProducts()
//   _lastFkSync = Date.now()
// }

// // ── Generic table puller ──────────────────────────────────────────────────────
// async function _pullTable({ endpoint, metaKey, model, label }) {
//   const since = await _getLastSync(metaKey)
//   const url = `${_baseUrl}${endpoint}${since ? `?since=${encodeURIComponent(since)}` : ''}`

//   console.log(`[Sync] Pulling ${label}${since ? ` since ${since}` : ' (full)'}…`)

//   const controller = new AbortController()
//   const timeout = setTimeout(() => controller.abort(), 10_000)

//   try {
//     const res = await fetch(url, { signal: controller.signal })
//     clearTimeout(timeout)
//     const json = await res.json()
//     if (!json.success) { console.error(`[Sync] ${label} error:`, json.error); return }

//     const rows = json.data ?? json.products ?? []

//     for (const row of rows) {
//       if (row.deletedAt) {
//         await model.destroy({ where: { id: row.id }, force: true }).catch(() => { })
//       } else {
//         // await model.upsert(row).catch(e => console.error(`[Sync] ${label} upsert err:`, e.message))
//         await model.upsert({ ...row }).catch(e => {
//           console.error(`[Sync] ${label} upsert err:`, e.message)
//           console.error(`[Sync] Failed row:`, JSON.stringify(row, null, 2))
//           console.error(`[Sync] Error name:`, e.name)
//           console.error(`[Sync] Error fields:`, e.fields)
//           console.error(`[Sync] Error errors:`, e.errors)
//           console.error(`[Sync] Full error dump:`, JSON.stringify(e, Object.getOwnPropertyNames(e), 2))
//         })
//       }
//     }

//     await _setLastSync(metaKey, json.serverTime)
//     console.log(`[Sync] ✅ ${label} done — ${rows.length} rows`)
//   } catch (err) {
//     clearTimeout(timeout)
//     if (err.name === 'AbortError') {
//       console.error(`[Sync] ❌ ${label} pull timed out`)
//     } else {
//       console.error(`[Sync] ❌ ${label} pull failed:`, err.message)
//     }
//   }
// }




// // function listenTableEvents(tableName, model, metaKey) {
// //   _ws.on(`${tableName}.created`, async ({ data, timestamp }) => {
// //     await model.upsert(data)
// //     if (timestamp) await _setLastSync(metaKey, timestamp)
// //   })

// //   _ws.on(`${tableName}.updated`, async ({ data, timestamp }) => {
// //     await model.upsert(data)
// //     if (timestamp) await _setLastSync(metaKey, timestamp)
// //   })

// //   _ws.on(`${tableName}.deleted`, async ({ data, timestamp }) => {
// //     await model.destroy({ where: { id: data.id }, force: true })
// //     if (timestamp) await _setLastSync(metaKey, timestamp)
// //   })
// // }




// function listenTableEvents(tableName, model, metaKey, childModels = {}) {
//   _ws.on(`${tableName}.created`, async ({ data, timestamp }) => {
//     await model.upsert(data)

//     // Upsert child models if present
//     for (const [childName, childModel] of Object.entries(childModels)) {
//       if (data[childName]) {
//           console.log("================in if statement=============",childModel)

//         for (const row of data[childName]) {
//           console.log("================inside loop=============",row)
//           console.log("================inside loop=============",childModel)
//           await childModel.upsert(row)
//         }
//       }
//     }

//     if (timestamp) await _setLastSync(metaKey, timestamp)
//   })

//   _ws.on(`${tableName}.updated`, async ({ data, timestamp }) => {
//     await model.upsert(data)

//     for (const [childName, childModel] of Object.entries(childModels)) {
//       if (data[childName]) {
//         for (const row of data[childName]) {
//           await childModel.upsert(row)
//         }
//       }
//     }

//     if (timestamp) await _setLastSync(metaKey, timestamp)
//   })

//   _ws.on(`${tableName}.deleted`, async ({ data, timestamp }) => {
//     await model.destroy({ where: { id: data.id }, force: true })
//     if (timestamp) await _setLastSync(metaKey, timestamp)
//   })
// }
// // ── Socket.IO connection ───────────────────────────────────────────────────────
// const RECONNECT_DELAY = 5000
// let _baseUrl = null, _ws = null, _stopped = false, _reconnectTimer = null

// function _connect() {
//   if (_stopped) return
//   console.log(`[Sync] Connecting → ${_baseUrl}`)

//   _ws = io(_baseUrl, {
//     reconnection: false  // manual reconnect so we control the delay
//   })

//   _ws.on('connect', async () => {
//     console.log('[Sync] ✅ Socket.IO connected:', _ws.id)
//     if (_reconnectTimer) { clearTimeout(_reconnectTimer); _reconnectTimer = null }
//     await _pullAll()
//      // generic real-time listeners
//   const tableMeta = [
//     { name: 'category', model: Category, metaKey: 'lastCategorySync' },
//     { name: 'unit', model: Unit, metaKey: 'lastUnitSync' },
//     { name: 'brand', model: Brand, metaKey: 'lastBrandSync' },
//     // { name: 'product', model: Product, metaKey: 'lastProductSync' },
//     {
//     name: 'product',
//     model: Product,
//     metaKey: 'lastProductSync',
//     children: { productUnits: ProductUnit } // child table
//   },
//     { name: 'company', model: Company, metaKey: 'lastCompanySync' },
//     { name: 'role', model: Role, metaKey: 'lastRoleSync' },
//     { name: 'permission', model: Permission, metaKey: 'lastPermissionSync' },
//     { name: 'rolepermission', model: RolePermission, metaKey: 'lastRolePermissionSync' },
//     // { name: 'productunit', model: ProductUnit, metaKey: 'lastProductUnitSync' }
   
//   ]

//   // tableMeta.forEach(t => listenTableEvents(t.name, t.model, t.metaKey))
//   tableMeta.forEach(t => {
//   listenTableEvents(t.name, t.model, t.metaKey, t.children || {})
// })
//   })

//   _ws.on('disconnect', (reason) => {
//     console.warn('[Sync] Disconnected:', reason, '— reconnecting in', RECONNECT_DELAY, 'ms')
//     _scheduleReconnect()
//   })

//   _ws.on('connect_error', (err) => {
//     console.error('[Sync] Connection error:', err.message, '— reconnecting in', RECONNECT_DELAY, 'ms')
//     _scheduleReconnect()
//   })
// }

// function _scheduleReconnect() {
//   if (_stopped || _reconnectTimer) return
//   _reconnectTimer = setTimeout(() => { _reconnectTimer = null; _connect() }, RECONNECT_DELAY)
// }

// // ── Public API ─────────────────────────────────────────────────────────────────
// async function start(baseUrl) {
//   _baseUrl = baseUrl.replace(/\/$/, '')
//   _stopped = false
//   await _initMeta()
//   _connect()
//   console.log(`[Sync] Service started → ${_baseUrl}`)
// }

// function stop() {
//   _stopped = true
//   if (_reconnectTimer) clearTimeout(_reconnectTimer)
//   if (_ws) { _ws.disconnect(); _ws = null }
//   console.log('[Sync] Service stopped.')
// }

// module.exports = { start, stop }



//==========
'use strict'

const db = require('../models')
const { Product, ProductUnit, Unit, Category, Brand, User, Role, Permission, Company, RolePermission } = db
const { DataTypes } = require('sequelize')
const { io } = require('socket.io-client')

// ── SyncMeta ──────────────────────────────────────────────────────────────────
let SyncMeta = null

async function _initMeta() {
  if (SyncMeta) return
  SyncMeta = db.sequelize.define('SyncMeta',
    { key: { type: DataTypes.STRING, primaryKey: true }, value: { type: DataTypes.TEXT } },
    { tableName: 'sync_meta', timestamps: false }
  )
  await SyncMeta.sync()
}

const _getMeta = async k => { const r = await SyncMeta.findByPk(k); return r?.value ?? null }
const _setMeta = async (k, v) => SyncMeta.upsert({ key: k, value: v })

// ── Pull tables ───────────────────────────────────────────────────────────────
const TABLES = [
  { endpoint: '/api/sync/companies',       metaKey: 'lastCompanySync',        model: Company },
  { endpoint: '/api/sync/permissions',     metaKey: 'lastPermissionSync',     model: Permission },
  { endpoint: '/api/sync/roles',           metaKey: 'lastRoleSync',           model: Role },
  { endpoint: '/api/sync/users',           metaKey: 'lastUserSync',           model: User },
  { endpoint: '/api/sync/units',           metaKey: 'lastUnitSync',           model: Unit },
  { endpoint: '/api/sync/categories',      metaKey: 'lastCategorySync',       model: Category },
  { endpoint: '/api/sync/brands',          metaKey: 'lastBrandSync',          model: Brand },
  // { endpoint: '/api/sync/products',        metaKey: 'lastProductSync',        model: Product },
  { endpoint: '/api/sync/products',        metaKey: 'lastProductSync',        model: Product,
    children: { units: ProductUnit },           // ← nested units
    stripKeys: ['units','category','brand']   // ← strip ALL nested objects before parent upsert
  },
  { endpoint: '/api/sync/rolepermissions', metaKey: 'lastRolePermissionSync', model: RolePermission },
  { endpoint: '/api/sync/productunit',     metaKey: 'lastProductUnitSync',    model: ProductUnit },
]

// Socket.IO real-time table config
// NOTE: ProductUnit changes are emitted as `product.updated` (with nested units)
//       so ProductUnit does NOT get its own listener here.
const RT_TABLES = [
  { name: 'category',       model: Category,        metaKey: 'lastCategorySync',       children: {} },
    { name: 'user',       model: User,        metaKey: 'lastUserSync',       children: {} },
  { name: 'unit',           model: Unit,            metaKey: 'lastUnitSync',           children: {} },
  { name: 'brand',          model: Brand,           metaKey: 'lastBrandSync',          children: {} },
  { name: 'company',        model: Company,         metaKey: 'lastCompanySync',        children: {} },
  { name: 'role',           model: Role,            metaKey: 'lastRoleSync',           children: {} },
  { name: 'permission',     model: Permission,      metaKey: 'lastPermissionSync',     children: {} },
  { name: 'rolepermission', model: RolePermission,  metaKey: 'lastRolePermissionSync', children: {} },
  { name: 'product',        model: Product,         metaKey: 'lastProductSync',        children: { units: ProductUnit } },
]

// async function _pullTable({ endpoint, metaKey, model }) {
//   const since = await _getMeta(metaKey)
//   const url = `${_baseUrl}${endpoint}${since ? `?since=${encodeURIComponent(since)}` : ''}`
//   console.log(`[Sync] Pulling ${model.name}${since ? ` since ${since}` : ' (full)'}…`)

//   const controller = new AbortController()
//   const timeout = setTimeout(() => controller.abort(), 10_000)

//   try {
//     const res = await fetch(url, { signal: controller.signal })
//     clearTimeout(timeout)
//     const json = await res.json()
//     if (!json.success) { console.error(`[Sync] ${model.name} error:`, json.error); return }

//     const rows = json.data ?? json.products ?? []
//     for (const row of rows) {
//       if (row.deletedAt) {
//         await model.destroy({ where: { id: row.id }, force: true }).catch(() => {})
//       } else {
//         await model.upsert(row).catch(e => console.error(`[Sync] ${model.name} upsert err:`, e.message))
//       }
//     }

//     await _setMeta(metaKey, json.serverTime)
//     console.log(`[Sync] ✅ ${model.name} — ${rows.length} rows`)
//   } catch (err) {
//     clearTimeout(timeout)
//     console.error(`[Sync] ❌ ${model.name}:`, err.name === 'AbortError' ? 'timed out' : err.message)
//   }
// }


async function _pullTable({ endpoint, metaKey, model, children = {}, stripKeys = [] }) {
  console.log("===========check if there is chikn",children)
  const since = await _getMeta(metaKey)
  const url = `${_baseUrl}${endpoint}${since ? `?since=${encodeURIComponent(since)}` : ''}`
  console.log(`[Sync] Pulling ${model.name}${since ? ` since ${since}` : ' (full)'}…`)

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 10_000)

  try {
    const res = await fetch(url, { signal: controller.signal })
    clearTimeout(timeout)
    const json = await res.json()
    if (!json.success) { console.error(`[Sync] ${model.name} error:`, json.error); return }

    const rows = json.data ?? json.products ?? []
    for (const row of rows) {
      if (row.deletedAt) {
        await model.destroy({ where: { id: row.id }, force: true }).catch(() => {})
        continue
      }

      // Save child arrays before stripping
      console.log("=================== rows" ,rows)
      const childRows = {}
      for (const key of Object.keys(children)) childRows[key] = row[key] ?? []

      // Strip ALL nested objects/arrays from parent row
      const parentRow = { ...row }
      for (const key of stripKeys) delete parentRow[key]

      await model.upsert(parentRow).catch(e => console.error(`[Sync] ${model.name} upsert err:`, e.message))

      // Upsert children
      for (const [key, childModel] of Object.entries(children)) {
        for (const childRow of childRows[key]) {
          // Strip nested objects from child row too (e.g. unit: {...} inside productUnit)
          const cleanChild = { ...childRow }
          for (const k of Object.keys(cleanChild)) {
            if (cleanChild[k] !== null && typeof cleanChild[k] === 'object' && !Array.isArray(cleanChild[k]) && !(cleanChild[k] instanceof Date)) {
              delete cleanChild[k]
            }
          }
          await childModel.upsert(cleanChild).catch(e => console.error(`[Sync] ${key} upsert err:`, e.message))
        }
      }
    }

    await _setMeta(metaKey, json.serverTime)
    console.log(`[Sync] ✅ ${model.name} — ${rows.length} rows`)
  } catch (err) {
    clearTimeout(timeout)
    console.error(`[Sync] ❌ ${model.name}:`, err.name === 'AbortError' ? 'timed out' : err.message)
  }
}

async function _pullAll() {
  for (const t of TABLES) await _pullTable(t)
}

// ── Real-time listeners ───────────────────────────────────────────────────────
function _listen({ name, model, metaKey, children }) {
  console.log("==================================== test",model,name,children)
  async function upsertWithChildren(data) {
  console.log("==================================== updaser childere",data)

    await model.upsert(data).catch(e => console.error(`[RT] ${name} upsert:`, e.message))
    for (const [key, childModel] of Object.entries(children)) {
      if (!data[key]) continue
      for (const row of data[key]) {
        await childModel.upsert(row).catch(e => console.error(`[RT] ${key} upsert:`, e.message))
      }
    }
  }

  _ws.on(`${name}.created`, async ({ data, timestamp }) => {
    await upsertWithChildren(data)
    if (timestamp) await _setMeta(metaKey, timestamp)
  })
  _ws.on(`${name}.updated`, async ({ data, timestamp }) => {
    await upsertWithChildren(data)
    if (timestamp) await _setMeta(metaKey, timestamp)
  })
  _ws.on(`${name}.deleted`, async ({ data, timestamp }) => {
    await model.destroy({ where: { id: data.id }, force: true }).catch(() => {})
    if (timestamp) await _setMeta(metaKey, timestamp)
  })
}

// ── Socket.IO ─────────────────────────────────────────────────────────────────
const RECONNECT_DELAY = 5_000
let _baseUrl = null, _ws = null, _stopped = false, _reconnectTimer = null

function _connect() {
  if (_stopped) return
  console.log(`[Sync] Connecting → ${_baseUrl}`)

  _ws = io(_baseUrl, { reconnection: false })

  _ws.on('connect', async () => {
    console.log('[Sync] ✅ Connected:', _ws.id)
    if (_reconnectTimer) { clearTimeout(_reconnectTimer); _reconnectTimer = null }
    await _pullAll()
    RT_TABLES.forEach(_listen)
  })

  _ws.on('disconnect', reason => {
    console.warn('[Sync] Disconnected:', reason)
    _scheduleReconnect()
  })

  _ws.on('connect_error', err => {
    console.error('[Sync] Connection error:', err.message)
    _scheduleReconnect()
  })
}

function _scheduleReconnect() {
  if (_stopped || _reconnectTimer) return
  _reconnectTimer = setTimeout(() => { _reconnectTimer = null; _connect() }, RECONNECT_DELAY)
}

// ── Public API ────────────────────────────────────────────────────────────────
async function start(baseUrl) {
  _baseUrl = baseUrl.replace(/\/$/, '')
  _stopped = false
  await _initMeta()
  _connect()
}

function stop() {
  _stopped = true
  if (_reconnectTimer) clearTimeout(_reconnectTimer)
  if (_ws) { _ws.disconnect(); _ws = null }
  console.log('[Sync] Stopped.')
}

module.exports = { start, stop }