// import { useState, useEffect } from 'react'
// import { ToastContainer, toast } from 'react-toastify'
// import InputFeild from '../components/InputFeild'
// import ButtonFeild from '../components/ButtonFeild'
// import DialogPopUp from '../components/DialogPopUp'
// import TableFeild from '../components/TableFeild'
// import PageHeading from '../components/PageHeading'
// import DeletePopup from '../components/DeletePopup'
// import { useDispatch, useSelector } from 'react-redux'
// import { PencilIcon, TrashIcon, KeyIcon, ShieldCheckIcon } from '@heroicons/react/24/solid'
// import { getUserPermissionsSlice } from '../store/roleSlice'

// export default function RoleManagement() {
//     const dispatch = useDispatch()
//   const [roles, setRoles] = useState([])
//   const [permissions, setPermissions] = useState({})
//   const [allPermissions, setAllPermissions] = useState([])

//   const [open, setOpen] = useState(false)
//   const [openPermissionsDialog, setOpenPermissionsDialog] = useState(false)
//   const [openDeletePopup, setOpenDeletePopup] = useState(false)

//   const [editItem, setEditItem] = useState(null)
//   const [deleteItem, setDeleteItem] = useState(null)
//   const [selectedRole, setSelectedRole] = useState(null)



//   // Form fields
//   const [name, setName] = useState('')
//   const [slug, setSlug] = useState('')
//   const [description, setDescription] = useState('')
//   const [status, setStatus] = useState(true)
//   const [selectedPermissions, setSelectedPermissions] = useState([])
//   const [openModules, setOpenModules] = useState([])

//   const toggleModule = (module) => {
//     setOpenModules((prev) =>
//       prev.includes(module) ? prev.filter((m) => m !== module) : [...prev, module]
//     )
//   }

//   // Load roles and permissions on mount
//   useEffect(() => {
//     loadRoles()
//     loadPermissions()
//   }, [])

//   useEffect(() => {
//   if (!editItem || !permissions || selectedPermissions.length === 0) return

//   const modulesToOpen = Object.entries(permissions)
//     .filter(([_, modulePerms]) =>
//       modulePerms.some((p) => selectedPermissions.includes(p.id))
//     )
//     .map(([module]) => module)

//   setOpenModules(modulesToOpen)
// }, [editItem, permissions, selectedPermissions])


//   const loadRoles = async () => {
//     const result = await window.api.getRoles({ status: 'all' })
//     if (result.success) {
//       setRoles(result.roles)
//     } else {
//       toast.error('Failed to load roles')
//     }
//   }

//   const loadPermissions = async () => {
//     const result = await window.api.getPermissionsGrouped()
//     if (result.success) {
//       setPermissions(result.permissions)

//       // Flatten for checkbox list
//       const flat = []
//       Object.values(result.permissions).forEach((modulePerms) => {
//         flat.push(...modulePerms)
//       })
//       setAllPermissions(flat)
//     }
//   }

//   // Auto-generate slug from name
//   useEffect(() => {
//     if (!editItem && name) {
//       const generatedSlug = name
//         .toLowerCase()
//         .replace(/[^a-z0-9]+/g, '-')
//         .replace(/^-+|-+$/g, '')
//       setSlug(generatedSlug)
//     }
//   }, [name, editItem])

//   const resetForm = () => {
//     setName('')
//     setSlug('')
//     setDescription('')
//     setStatus(true)
//     setSelectedPermissions([])
//     setEditItem(null)
//     setOpen(false)
//   }

//   const handleCreate = async (e) => {
//     e.preventDefault()

//     if (!name.trim() || !slug.trim()) {
//       toast.error('Name and slug are required')
//       return
//     }

//     const result = await window.api.createRole({
//       name,
//       slug,
//       description,
//       is_active: status,
//       permissions: selectedPermissions
//     })

//     if (result.success) {
//       toast.success('Role created successfully')
//       resetForm()
//       loadRoles()
//     } else {
//       toast.error(result.error)
//     }
//   }

//   const handleUpdate = async (e) => {
//     e.preventDefault()

//     const result = await window.api.updateRole(editItem.id, {
//       name,
//       slug,
//       description,
//       is_active: status,
//       permissions: selectedPermissions
//     })

//     if (result.success) {
//       toast.success('Role updated successfully')
//       resetForm()
//       loadRoles()
//     } else {
//       toast.error(result.error)
//     }
//   }

//   const handleDelete = async () => {
//     const result = await window.api.deleteRole(deleteItem.id)

//     if (result.success) {
//       toast.success('Role deleted successfully')
//       loadRoles()
//       setOpenDeletePopup(false)
//     } else {
//       toast.error(result.error)
//     }
//   }

//   const handleManagePermissions = async (role) => {
//     setSelectedRole(role)

//     // Load role details with permissions
//     const result = await window.api.getRoleById(role.id)
//     if (result.success) {
//       const rolePermissionIds = result.role.permissions.map((p) => p.id)
//       setSelectedPermissions(rolePermissionIds)
//       setOpenPermissionsDialog(true)
//     } else {
//       toast.error('Failed to load role permissions')
//     }
//   }


//   const handleSavePermissions = async () => {
//     const result = await window.api.assignPermissions(selectedRole.id, selectedPermissions)
//     console.log(selectedRole.id)
//        dispatch(getUserPermissionsSlice(selectedRole.id))
//     if (result.success) {
//       toast.success('Permissions updated successfully')
//       setOpenPermissionsDialog(false)
//       loadRoles()
//     } else {
//       toast.error(result.error)
//     }
//   }

//   const togglePermission = (permissionId) => {
//     setSelectedPermissions((prev) => {
//       if (prev.includes(permissionId)) {
//         return prev.filter((id) => id !== permissionId)
//       } else {
//         return [...prev, permissionId]
//       }
//     })
//   }

//   const selectAllInModule = (moduleName) => {
//     const modulePerms = permissions[moduleName] || []
//     const moduleIds = modulePerms.map((p) => p.id)

//     const allSelected = moduleIds.every((id) => selectedPermissions.includes(id))

//     if (allSelected) {
//       // Deselect all in module
//       setSelectedPermissions((prev) => prev.filter((id) => !moduleIds.includes(id)))
//     } else {
//       // Select all in module
//       setSelectedPermissions((prev) => [...new Set([...prev, ...moduleIds])])
//     }
//   }

//   const columns = [
//     {
//       label: 'Name',
//       accessor: 'name',
//       render: (row) => (
//         <div className="flex items-center gap-2">
//           <ShieldCheckIcon className="w-5 h-5 text-blue-600" />
//           <div>
//             <p className="font-semibold">{row.name}</p>
//             <p className="text-xs text-gray-500">{row.slug}</p>
//           </div>
//         </div>
//       )
//     },
//     { label: 'Description', accessor: 'description', render: (row) => row.description || '-' },
//     {
//       label: 'Permissions',
//       accessor: 'permissions_count',
//       render: (row) => (
//         <span className="px-2 py-1 bg-blue-100 text-blue-600 rounded text-sm font-medium">
//           {row.permissions_count} permissions
//         </span>
//       )
//     },
//     {
//       label: 'Status',
//       accessor: 'status',
//       render: (row) => (
//         <span
//           className={`px-2 py-1 rounded text-xs ${
//             row.is_active ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
//           }`}
//         >
//           {row.is_active ? 'Active' : 'Inactive'}
//         </span>
//       )
//     },
//     {
//       label: 'System Role',
//       accessor: 'is_system_role',
//       render: (row) =>
//         row.is_system_role ? <span className="text-xs text-gray-500">✓ System</span> : '-'
//     }
//   ]

//   const actions = [
//     {
//       label: 'Permissions',
//       icon: KeyIcon,
//       className: 'bg-purple-500 text-white hover:bg-purple-600 rounded-md',
//       onClick: (row) => handleManagePermissions(row)
//     },
//     {
//       label: 'Edit',
//       icon: PencilIcon,
//       className: 'bg-primary-dark text-white hover:bg-blue-600 rounded-md',
//       onClick: async (row) => {
//         setOpen(true)
//         setEditItem(row)
//         setName(row.name)
//         // setSlug(row.slug);
//         setDescription(row.description || '')
//         setStatus(row.is_active)

//         // Load role permissions
//         const result = await window.api.getRoleById(row.id)
//         if (result.success) {
//           setSelectedPermissions(result.role.permissions.map((p) => p.id))
//         }
//       }
//     },
//     {
//       label: 'Delete',
//       icon: TrashIcon,
//       className: 'bg-red-500 text-white hover:bg-red-600 rounded-md',
//       onClick: (row) => {
//         if (row.is_system) {
//           toast.error('System roles cannot be deleted')
//           return
//         }
//         setDeleteItem(row)
//         setOpenDeletePopup(true)
//       }
//     }
//   ]

//   return (
//     <div className="h-screen overflow-hidden flex flex-col p-6 gap-4">
//       <ToastContainer />

//       {/* Header */}
//       <div className="bg-white p-6 rounded-xl shadow-sm">
//         <div className="flex justify-between items-center">
//           <PageHeading
//             title="Role Management"
//             subtitle="Manage user roles and permissions"
//             className="w-full"
//           />
//           <ButtonFeild
//             onClick={() => setOpen(true)}
//             label="Create Role"
//             className="w-auto max-w-[200px] px-4 py-2"
//           />
//         </div>
//       </div>

//       {/* Delete Popup */}
//       <DeletePopup
//         open={openDeletePopup}
//         itemName={deleteItem?.name}
//         onConfirm={handleDelete}
//         onClose={() => setOpenDeletePopup(false)}
//       />

//       {/* Create/Edit Role Dialog */}
//       <DialogPopUp isOpen={open} onClose={resetForm} className="w-full max-w-4xl max-h-[90vh] overflow-y-auto ">
//         <form onSubmit={editItem ? handleUpdate : handleCreate} className="space-y-2">
//           <PageHeading
//             title={editItem ? 'Update Role' : 'Create New Role'}
//             subtitle="Define role details and assign permissions"
//           />

//           <InputFeild
//             label="Role Name *"
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//             placeholder="e.g., Store Manager"
//             required
//           />

//           <InputFeild
//             label="Description"
//             value={description}
//             onChange={(e) => setDescription(e.target.value)}
//             placeholder="Brief description of this role"
//           />

//           <div className="flex items-center gap-2">
//             <input
//               type="checkbox"
//               checked={status}
//               onChange={(e) => setStatus(e.target.checked)}
//               className="w-4 h-4"
//             />
//             <label className="text-sm font-medium">Active</label>
//           </div>

//           {/* Permissions Section */}
//           <div className="border-t pt-4 ">
//             <h3 className="font-semibold mb-3">Assign Permissions</h3>

//             <div className="space-y-3 ">
//               {Object.entries(permissions).map(([module, modulePerms]) => {
//                 const moduleIds = modulePerms.map((p) => p.id)
//                 const allSelected = moduleIds.every((id) => selectedPermissions.includes(id))

//                 const isOpen = openModules.includes(module)

//                 return (
//                   <div key={module} className="border rounded-lg overflow-hidden">
//                     {/* Module Header */}
//                     <div className="flex items-center justify-between px-4 py-3 bg-gray-50">
//                       <div className="flex items-center gap-3">
//                         <input
//                           type="checkbox"
//                           checked={allSelected}
//                           onChange={() => selectAllInModule(module)}
//                           className="w-4 h-4"
//                         />
//                         <span className="font-medium capitalize">{module}</span>
//                       </div>

//                       <button
//                         type="button"
//                         onClick={() => toggleModule(module)}
//                         className="text-sm text-blue-600 font-medium"
//                       >
//                         {isOpen ? 'Close' : 'Open'}
//                       </button>
//                     </div>

//                     {/* Permissions List */}
//                     {isOpen && (
//                       <div className="px-6 py-4 grid grid-cols-2 gap-3 bg-white">
//                         {modulePerms.map((permission) => (
//                           <label key={permission.id} className="flex items-center gap-2 text-sm">
//                             <input
//                               type="checkbox"
//                               checked={selectedPermissions.includes(permission.id)}
//                               onChange={() => togglePermission(permission.id)}
//                               className="w-4 h-4"
//                             />
//                             <span>{permission.name}</span>
//                           </label>
//                         ))}
//                       </div>
//                     )}
//                   </div>
//                 )
//               })}
//             </div>
//           </div>

//           <ButtonFeild label={editItem ? 'Update Role' : 'Create Role'} type="submit" />
//         </form>
//       </DialogPopUp>

//       {/* Manage Permissions Dialog */}
//       <DialogPopUp
//         isOpen={openPermissionsDialog}
//         onClose={() => setOpenPermissionsDialog(false)}
//         className="w-full max-w-4xl max-h-[90vh] "
//       >
//         <div className="space-y-4">
//           <PageHeading
//             title={`Manage Permissions: ${selectedRole?.name}`}
//             subtitle="Select permissions for this role"
//           />

//           <div className=" overflow-y-auto border rounded-lg p-4 bg-white max-h-96">
//             {Object.entries(permissions).map(([module, modulePerms]) => {
//               const moduleIds = modulePerms.map((p) => p.id)
//               const allSelected = moduleIds.every((id) => selectedPermissions.includes(id))

//               return (
//                 <div key={module} className="mb-4 pb-4 border-b last:border-b-0">
//                   <div className="flex items-center gap-2 mb-2">
//                     <input
//                       type="checkbox"
//                       checked={allSelected}
//                       onChange={() => selectAllInModule(module)}
//                       className="w-4 h-4"
//                     />
//                     <h4 className="font-semibold capitalize text-lg">{module}</h4>
//                     <span className="text-xs text-gray-500">
//                       ({modulePerms.filter((p) => selectedPermissions.includes(p.id)).length}/
//                       {modulePerms.length})
//                     </span>
//                   </div>
//                   <div className="grid grid-cols-2 gap-2 ml-6">
//                     {modulePerms.map((permission) => (
//                       <label
//                         key={permission.id}
//                         className="flex items-center gap-2 text-sm hover:bg-gray-50 p-2 rounded"
//                       >
//                         <input
//                           type="checkbox"
//                           checked={selectedPermissions.includes(permission.id)}
//                           onChange={() => togglePermission(permission.id)}
//                           className="w-4 h-4"
//                         />
//                         <div>
//                           <span className="font-medium">{permission.name}</span>
//                           {permission.description && (
//                             <p className="text-xs text-gray-500">{permission.description}</p>
//                           )}
//                         </div>
//                       </label>
//                     ))}
//                   </div>
//                 </div>
//               )
//             })}
//           </div>

//           <div className="flex gap-3">
//             <ButtonFeild
//               onClick={handleSavePermissions}
//               label="Save Permissions"
//               className="flex-1"
//             />
//             {/* <button
//               onClick={() => setOpenPermissionsDialog(false)}
//               className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
//             >
//               Cancel
//             </button> */}
//           </div>
//         </div>
//       </DialogPopUp>

//       {/* Table */}
//       <div className="flex-1 overflow-auto bg-white rounded-xl shadow-sm">
//         <TableFeild columns={columns} data={roles} actions={actions} />
//       </div>
//     </div>
//   )
// }

import { useState, useEffect } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import InputFeild from '../components/InputFeild'
import ButtonFeild from '../components/ButtonFeild'
import DialogPopUp from '../components/DialogPopUp'
import TableFeild from '../components/TableFeild'
import PageHeading from '../components/PageHeading'
import DeletePopup from '../components/DeletePopup'
import { useDispatch, useSelector } from 'react-redux'
import { PencilIcon, TrashIcon, KeyIcon, ShieldCheckIcon } from '@heroicons/react/24/solid'

import {
  getRolesSlice,
  createRoleSlice,
  updateRoleSlice,
  deleteRoleSlice,
  getRoleByIdSlice,
  assignPermissionsSlice,
  getUserPermissionsSlice,
  getPermissionsGroupedSlice,
} from '../store/roleSlice'

export default function RoleManagement() {
  const dispatch = useDispatch()

  // ── Redux state ───────────────────────────────────────────────────────────
  const roles              = useSelector((state) => state.role.list)
  const permissionsGrouped = useSelector((state) => state.role.permissionsGrouped)

  // ── Local UI state ────────────────────────────────────────────────────────
  const [allPermissions, setAllPermissions] = useState([])

  const [open,                  setOpen]                  = useState(false)
  const [openPermissionsDialog, setOpenPermissionsDialog] = useState(false)
  const [openDeletePopup,       setOpenDeletePopup]       = useState(false)

  const [editItem,    setEditItem]    = useState(null)
  const [deleteItem,  setDeleteItem]  = useState(null)
  const [selectedRole, setSelectedRole] = useState(null)

  // Form fields
  const [name,                setName]                = useState('')
  const [description,         setDescription]         = useState('')
  const [status,              setStatus]              = useState(true)
  const [selectedPermissions, setSelectedPermissions] = useState([])
  const [openModules,         setOpenModules]         = useState([])

  // ── On mount: load roles + grouped permissions ────────────────────────────
  useEffect(() => {
    dispatch(getRolesSlice({ status: 'all' }))
    dispatch(getPermissionsGroupedSlice())
  }, [dispatch])

  // Flatten grouped permissions whenever they change
  useEffect(() => {
    if (!permissionsGrouped) return
    const flat = Object.values(permissionsGrouped).flat()
    setAllPermissions(flat)
  }, [permissionsGrouped])

  // Auto-open modules that contain already-selected permissions (edit mode)
  useEffect(() => {
    if (!editItem || !permissionsGrouped || selectedPermissions.length === 0) return
    const modulesToOpen = Object.entries(permissionsGrouped)
      .filter(([, modulePerms]) => modulePerms.some((p) => selectedPermissions.includes(p.id)))
      .map(([module]) => module)
    setOpenModules(modulesToOpen)
  }, [editItem, permissionsGrouped, selectedPermissions])

  // ── Helpers ───────────────────────────────────────────────────────────────
  const toggleModule = (module) =>
    setOpenModules((prev) =>
      prev.includes(module) ? prev.filter((m) => m !== module) : [...prev, module]
    )

  const resetForm = () => {
    setName('')
    setDescription('')
    setStatus(true)
    setSelectedPermissions([])
    setOpenModules([])
    setEditItem(null)
    setOpen(false)
  }

  const togglePermission = (id) =>
    setSelectedPermissions((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )

  const selectAllInModule = (moduleName) => {
    const ids = (permissionsGrouped[moduleName] || []).map((p) => p.id)
    const allSelected = ids.every((id) => selectedPermissions.includes(id))
    setSelectedPermissions((prev) =>
      allSelected ? prev.filter((id) => !ids.includes(id)) : [...new Set([...prev, ...ids])]
    )
  }

  // ── CRUD handlers ─────────────────────────────────────────────────────────
  const handleCreate = async (e) => {
    e.preventDefault()
    if (!name.trim()) { toast.error('Name is required'); return }

    const result = await dispatch(createRoleSlice({
      name, description, is_active: status, permissions: selectedPermissions
    })).unwrap()

    if (result.success) {
      toast.success('Role created successfully')
      resetForm()
    } else {
      toast.error(result.error)
    }
  }

  const handleUpdate = async (e) => {
    e.preventDefault()

    const result = await dispatch(updateRoleSlice({
      id: editItem.id,
      data: { name, description, is_active: status, permissions: selectedPermissions }
    })).unwrap()

    if (result.success) {
      toast.success('Role updated successfully')
      resetForm()
    } else {
      toast.error(result.error)
    }
  }

  const handleDelete = async () => {
    const result = await dispatch(deleteRoleSlice(deleteItem.id)).unwrap()
    if (result.success) {
      toast.success('Role deleted successfully')
      setOpenDeletePopup(false)
    } else {
      toast.error(result.error)
    }
  }

  const handleManagePermissions = async (role) => {
    setSelectedRole(role)
    const result = await dispatch(getRoleByIdSlice(role.id)).unwrap()
    if (result.success) {
      setSelectedPermissions(result.role.permissions.map((p) => p.id))
      setOpenPermissionsDialog(true)
    } else {
      toast.error('Failed to load role permissions')
    }
  }

  const handleSavePermissions = async () => {
    const result = await dispatch(
      assignPermissionsSlice({ roleId: selectedRole.id, permissionIds: selectedPermissions })
    ).unwrap()

    // Refresh permissions for the current logged-in user
    dispatch(getUserPermissionsSlice(selectedRole.id))

    if (result.success) {
      toast.success('Permissions updated successfully')
      setOpenPermissionsDialog(false)
      dispatch(getRolesSlice({ status: 'all' }))
    } else {
      toast.error(result.error)
    }
  }

  // ── Table config ──────────────────────────────────────────────────────────
  const columns = [
    {
      label: 'Name',
      accessor: 'name',
      render: (row) => (
        <div className="flex items-center gap-2">
          <ShieldCheckIcon className="w-5 h-5 text-blue-600" />
          <div>
            <p className="font-semibold">{row.name}</p>
            <p className="text-xs text-gray-500">{row.slug}</p>
          </div>
        </div>
      )
    },
    { label: 'Description', accessor: 'description', render: (row) => row.description || '-' },
    {
      label: 'Permissions',
      accessor: 'permissions_count',
      render: (row) => (
        <span className="px-2 py-1 bg-blue-100 text-blue-600 rounded text-sm font-medium">
          {row.permissions_count} permissions
        </span>
      )
    },
    {
      label: 'Status',
      accessor: 'status',
      render: (row) => (
        <span className={`px-2 py-1 rounded text-xs ${row.is_active ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
          {row.is_active ? 'Active' : 'Inactive'}
        </span>
      )
    },
    {
      label: 'System Role',
      accessor: 'is_system_role',
      render: (row) => row.is_system_role ? <span className="text-xs text-gray-500">✓ System</span> : '-'
    }
  ]

  const actions = [
    {
      label: 'Permissions',
      icon: KeyIcon,
      className: 'bg-purple-500 text-white hover:bg-purple-600 rounded-md',
      onClick: (row) => handleManagePermissions(row)
    },
    {
      label: 'Edit',
      icon: PencilIcon,
      className: 'bg-primary-dark text-white hover:bg-blue-600 rounded-md',
      onClick: async (row) => {
        setEditItem(row)
        setName(row.name)
        setDescription(row.description || '')
        setStatus(row.is_active)

        const result = await dispatch(getRoleByIdSlice(row.id)).unwrap()
        if (result.success) {
          setSelectedPermissions(result.role.permissions.map((p) => p.id))
        }
        setOpen(true)
      }
    },
    {
      label: 'Delete',
      icon: TrashIcon,
      className: 'bg-red-500 text-white hover:bg-red-600 rounded-md',
      onClick: (row) => {
        if (row.is_system_role) { toast.error('System roles cannot be deleted'); return }
        setDeleteItem(row)
        setOpenDeletePopup(true)
      }
    }
  ]

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="h-screen overflow-hidden flex flex-col p-6 gap-4">
      <ToastContainer />

      {/* Header */}
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <div className="flex justify-between items-center">
          <PageHeading title="Role Management" subtitle="Manage user roles and permissions" className="w-full" />
          <ButtonFeild onClick={() => setOpen(true)} label="Create Role" className="w-auto max-w-[200px] px-4 py-2" />
        </div>
      </div>

      {/* Delete Popup */}
      <DeletePopup
        open={openDeletePopup}
        itemName={deleteItem?.name}
        onConfirm={handleDelete}
        onClose={() => setOpenDeletePopup(false)}
      />

      {/* Create / Edit Dialog */}
      <DialogPopUp isOpen={open} onClose={resetForm} className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <form onSubmit={editItem ? handleUpdate : handleCreate} className="space-y-2">
          <PageHeading
            title={editItem ? 'Update Role' : 'Create New Role'}
            subtitle="Define role details and assign permissions"
          />

          <InputFeild
            label="Role Name *"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Store Manager"
            required
          />
          <InputFeild
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Brief description of this role"
          />
          <div className="flex items-center gap-2">
            <input type="checkbox" checked={status} onChange={(e) => setStatus(e.target.checked)} className="w-4 h-4" />
            <label className="text-sm font-medium">Active</label>
          </div>

          {/* Permissions */}
          <div className="border-t pt-4">
            <h3 className="font-semibold mb-3">Assign Permissions</h3>
            <div className="space-y-3">
              {Object.entries(permissionsGrouped).map(([module, modulePerms]) => {
                const moduleIds = modulePerms.map((p) => p.id)
                const allSelected = moduleIds.every((id) => selectedPermissions.includes(id))
                const isOpen = openModules.includes(module)
                return (
                  <div key={module} className="border rounded-lg overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-3 bg-gray-50">
                      <div className="flex items-center gap-3">
                        <input type="checkbox" checked={allSelected} onChange={() => selectAllInModule(module)} className="w-4 h-4" />
                        <span className="font-medium capitalize">{module}</span>
                      </div>
                      <button type="button" onClick={() => toggleModule(module)} className="text-sm text-blue-600 font-medium">
                        {isOpen ? 'Close' : 'Open'}
                      </button>
                    </div>
                    {isOpen && (
                      <div className="px-6 py-4 grid grid-cols-2 gap-3 bg-white">
                        {modulePerms.map((permission) => (
                          <label key={permission.id} className="flex items-center gap-2 text-sm">
                            <input
                              type="checkbox"
                              checked={selectedPermissions.includes(permission.id)}
                              onChange={() => togglePermission(permission.id)}
                              className="w-4 h-4"
                            />
                            <span>{permission.name}</span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          <ButtonFeild label={editItem ? 'Update Role' : 'Create Role'} type="submit" />
        </form>
      </DialogPopUp>

      {/* Manage Permissions Dialog */}
      <DialogPopUp
        isOpen={openPermissionsDialog}
        onClose={() => setOpenPermissionsDialog(false)}
        className="w-full max-w-4xl max-h-[90vh]"
      >
        <div className="space-y-4">
          <PageHeading
            title={`Manage Permissions: ${selectedRole?.name}`}
            subtitle="Select permissions for this role"
          />
          <div className="overflow-y-auto border rounded-lg p-4 bg-white max-h-96">
            {Object.entries(permissionsGrouped).map(([module, modulePerms]) => {
              const moduleIds = modulePerms.map((p) => p.id)
              const allSelected = moduleIds.every((id) => selectedPermissions.includes(id))
              return (
                <div key={module} className="mb-4 pb-4 border-b last:border-b-0">
                  <div className="flex items-center gap-2 mb-2">
                    <input type="checkbox" checked={allSelected} onChange={() => selectAllInModule(module)} className="w-4 h-4" />
                    <h4 className="font-semibold capitalize text-lg">{module}</h4>
                    <span className="text-xs text-gray-500">
                      ({modulePerms.filter((p) => selectedPermissions.includes(p.id)).length}/{modulePerms.length})
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 ml-6">
                    {modulePerms.map((permission) => (
                      <label key={permission.id} className="flex items-center gap-2 text-sm hover:bg-gray-50 p-2 rounded">
                        <input
                          type="checkbox"
                          checked={selectedPermissions.includes(permission.id)}
                          onChange={() => togglePermission(permission.id)}
                          className="w-4 h-4"
                        />
                        <div>
                          <span className="font-medium">{permission.name}</span>
                          {permission.description && (
                            <p className="text-xs text-gray-500">{permission.description}</p>
                          )}
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
          <ButtonFeild onClick={handleSavePermissions} label="Save Permissions" className="flex-1" />
        </div>
      </DialogPopUp>

      {/* Table */}
      <div className="flex-1 overflow-auto bg-white rounded-xl shadow-sm">
        <TableFeild columns={columns} data={roles} actions={actions} />
      </div>
    </div>
  )
}