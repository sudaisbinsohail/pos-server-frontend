

import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  Bars3BottomRightIcon,
  Bars3Icon
} from '@heroicons/react/24/solid'

import inventoryIcon from '../assets/icons/inventory.png'
import purchaseIcon  from '../assets/icons/purchase.png'
import saleIcon      from '../assets/icons/sale.png'
import settingIcon   from '../assets/icons/settings.png'
import logoutIcon    from '../assets/icons/logout.png'

import { getUserPermissionsSlice } from '../store/roleSlice'
import { logoutUser, getProfile }  from '../store/userSlice'  // ← NEW

export default function Dashboard() {
  const location = useLocation()
  const navigate  = useNavigate()
  const dispatch  = useDispatch()

  const [openMenu,      setOpenMenu]      = useState(null)
  const [activeMenu,    setActiveMenu]    = useState(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  // ── Redux state ──────────────────────────────────────────────────────────
  const currentUser        = useSelector((state) => state.users.currentUser)
  const userPermissions    = useSelector((state) => state.role.userPermissions)
  const permissionsLoading = useSelector((state) => state.role.permissionsLoading)

  // ── Load profile → then permissions ──────────────────────────────────────
  useEffect(() => {
    const load = async () => {
      try {
        // If we already have the user in Redux (e.g. just logged in), use it.
        // Otherwise fetch from /auth/profile (token is in localStorage).
        let userId = currentUser?.id

        if (!userId) {
          const result = await dispatch(getProfile()).unwrap()
          if (result.success) userId = result.user.id
        }

        if (userId) {
          dispatch(getUserPermissionsSlice(userId))
        }
      } catch (err) {
        console.error('Error loading user session:', err)
      }
    }

    load()
  }, [dispatch]) // run once on mount

  // ── Handlers ─────────────────────────────────────────────────────────────
  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev)
    setOpenMenu(null)
  }

  const handleMenuClick = (index) => {
    if (!isSidebarOpen) {
      setIsSidebarOpen(true)
      setOpenMenu(index)
      setActiveMenu(index)
      return
    }
    setOpenMenu(openMenu === index ? null : index)
    setActiveMenu(index)
  }

  const handleLogout = async () => {
    await dispatch(logoutUser())   // clears token from localStorage
    navigate('/login')
  }

  // ── Permission helper ─────────────────────────────────────────────────────
  const hasPermission = (permissionName) => {
    if (!userPermissions?.length) return false
    return userPermissions.some((p) => p.name === permissionName)
  }

  // ── Menu definition ───────────────────────────────────────────────────────
  const allMenuItems = [
    {
      title: 'Sales',
      icon: saleIcon,
      children: [
        { name: 'POS',          path: '/dashboard/pos',               permission: 'tab.pos' },
        { name: 'Customer',     path: '/dashboard/customermanagement', permission: 'tab.customer' },
        { name: 'Sale History', path: '/dashboard/salehistory',        permission: 'tab.sale_history' }
      ]
    },
    {
      title: 'Inventory',
      icon: inventoryIcon,
      children: [
        { name: 'Products', path: '/dashboard/products', permission: 'tab.products' },
        { name: 'Category', path: '/dashboard/category', permission: 'tab.category' },
        { name: 'Brand',    path: '/dashboard/brand',    permission: 'tab.brand' },
        { name: 'Unit',     path: '/dashboard/unit',     permission: 'tab.unit' }
      ]
    },
    {
      title: 'Purchasing',
      icon: purchaseIcon,
      children: [
        { name: 'Supplier', path: '/dashboard/supplier', permission: 'tab.supplier' }
      ]
    },
    {
      title: 'Settings',
      icon: settingIcon,
      children: [
        { name: 'Users',              path: '/dashboard/users',           permission: 'tab.users' },
        { name: 'Company',            path: '/dashboard/settingCompany',  permission: 'tab.company' },
        { name: 'Roles & Permissions',path: '/dashboard/roles',           permission: 'tab.roles' }
      ]
    }
  ]

  const menuItems = allMenuItems
    .map((menu) => {
      const filteredChildren = menu.children.filter((child) =>
        hasPermission(child.permission)
      )
      return filteredChildren.length ? { ...menu, children: filteredChildren } : null
    })
    .filter(Boolean)

  const permissionsLoaded = !permissionsLoading && userPermissions.length >= 0

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="flex h-screen">
      {/* SIDEBAR */}
      <nav
        className={`bg-primary-dark text-white flex flex-col transition-all duration-300
          ${isSidebarOpen ? 'w-64' : 'w-20'} p-4`}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between mb-6">
          {isSidebarOpen && (
            <h2 className="text-2xl font-extrabold tracking-wide text-white">invodesk</h2>
          )}
          <button
            onClick={toggleSidebar}
            className="w-10 h-10 flex items-center justify-center rounded-full
                       bg-white text-primary-dark font-extrabold text-2xl
                       shadow hover:scale-105 transition"
            title={isSidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            {isSidebarOpen
              ? <Bars3BottomRightIcon className="h-6 w-6 text-gray-700" />
              : <Bars3Icon            className="h-6 w-6 text-gray-700" />}
          </button>
        </div>

        {/* Loading */}
        {permissionsLoading && (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mb-2" />
            <p className="text-sm text-gray-300">Loading permissions...</p>
          </div>
        )}

        {/* No permissions */}
        {permissionsLoaded && menuItems.length === 0 && (
          <div className="text-sm text-gray-300 p-4 bg-red-900/20 rounded text-center">
            No permissions assigned. Please contact your administrator.
          </div>
        )}

        {/* MENU ITEMS */}
        {permissionsLoaded && menuItems.map((item, index) => {
          const isActiveMenu = activeMenu === index
          return (
            <div key={index} className="mb-2">
              <div
                onClick={() => handleMenuClick(index)}
                className={`cursor-pointer flex items-center justify-between p-2 rounded-lg text-lg
                  ${isActiveMenu
                    ? 'bg-primary-light text-primary-dark font-bold'
                    : 'hover:bg-primary-light hover:text-primary-dark'}`}
              >
                <span className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-primary-dark rounded-lg flex items-center justify-center">
                    <img src={item.icon} className="w-5 h-5" alt={item.title} />
                  </div>
                  {isSidebarOpen && item.title}
                </span>
                {isSidebarOpen && (
                  <span className="text-2xl font-extrabold">
                    {openMenu === index ? '−' : '+'}
                  </span>
                )}
              </div>

              {openMenu === index && isSidebarOpen && (
                <div className="ml-6 mt-2 flex flex-col gap-1 bg-white rounded-lg p-2 shadow">
                  {item.children.map((child, i) => {
                    const isActive = location.pathname === child.path
                    return (
                      <Link
                        key={i}
                        to={child.path}
                        className={`p-2 rounded text-sm transition
                          ${isActive
                            ? 'bg-primary-dark text-white font-semibold'
                            : 'text-primary-dark hover:bg-primary-light'}`}
                      >
                        {child.name}
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}

        {/* LOGOUT */}
        <div
          onClick={handleLogout}
          className="mt-auto cursor-pointer p-2 rounded-lg hover:bg-red-600 transition"
        >
          <span className="flex items-center gap-3">
            <div className="w-9 h-9 bg-primary-dark rounded-lg flex items-center justify-center">
              <img src={logoutIcon} className="w-5 h-5" alt="Logout" />
            </div>
            {isSidebarOpen && <p className="font-semibold">Logout</p>}
          </span>
        </div>
      </nav>

      {/* CONTENT */}
      <div className="flex-1 bg-gray-50 overflow-auto">
        <Outlet />
      </div>
    </div>
  )
}