// import React, { useState, useEffect } from 'react'
// import InputField from '../components/InputFeild'
// import ButtonFeild from '../components/ButtonFeild'
// import PageHeading from '../components/PageHeading'
// import DropdownFeild from '../components/DropdownFeild'
// import TableFeild from '../components/TableFeild'
// import { ToastContainer, toast } from 'react-toastify'
// import SortableSimpleTable from '../components/SortableTable'
// import { useDispatch, useSelector } from 'react-redux'
// import {
//   createUnitSlice,
//   getUnitsSlice,
//   updateUnitSlice,
//   deleteUnitSlice,
//   restoreUnitSlice
// } from '../store/unitSlice'

// import { PencilIcon, TrashIcon } from '@heroicons/react/24/solid'

// export default function Unit() {
//   const dispatch = useDispatch()
//   const units = useSelector((state) => state.unit.list)

//   // Form fields
//   const [unitName, setUnitName] = useState('')
//   const [abbreviation, setAbbreviation] = useState('')
//   const [baseUnit, setBaseUnit] = useState('')
//   const [conversion, setConversion] = useState('')
//   const [notes, setNotes] = useState('')

//   const [editId, setEditId] = useState(null)

//   // Load units on mount
//   useEffect(() => {
//     dispatch(getUnitsSlice({ search: '' }))
//   }, [dispatch])

//   // Table Columns
//   const columns = [
//     // { label: "ID", accessor: "id" },
//     { label: 'Unit Name', accessor: 'unit_name' },
//     { label: 'Abbrev', accessor: 'abbreviation' }
//     // { label: "Base Unit", accessor: "base_unit_name" },
//     // { label: "Conversion", accessor: "universal_conversion" }
//   ]

//   // Handle Create
//   const handleCreateUnit = async (e) => {
//     e.preventDefault()
//     let user_id = await window.api.getUserSession()
//     const data = {
//       unit_name: unitName,
//       abbreviation,
//       base_unit_id: baseUnit || null,
//       universal_conversion: conversion || null,
//       user_id,
//       notes
//     }

//     const result = await dispatch(createUnitSlice(data)).unwrap()

//     if (result.success) {
//       toast.success('Unit created!')
//       dispatch(getUnitsSlice())
//       resetForm()
//     } else {
//       toast.error(result.error)
//     }
//   }

//   // Handle Update
//   const handleUpdateUnit = async (e) => {
//     e.preventDefault()

//     const data = {
//       unit_name: unitName,
//       abbreviation,
//       base_unit_id: baseUnit || null,
//       universal_conversion: conversion || null,
//       notes
//     }

//     const result = await dispatch(updateUnitSlice({ id: editId, data })).unwrap()

//     if (result.success) {
//       toast.success('Unit updated!')
//       dispatch(getUnitsSlice())
//       resetForm()
//     } else {
//       toast.error(result.error)
//     }
//   }

//   // Reset form
//   const resetForm = () => {
//     setUnitName('')
//     setAbbreviation('')
//     setBaseUnit('')
//     setConversion('')
//     setNotes('')
//     setEditId(null)
//   }

//   // Table Actions
//   const actions = [
//     {
//       label: 'Edit',
//       icon: PencilIcon,
//       className: 'bg-primary-dark text-white hover:bg-blue-600 rounded-md',
//       onClick: (row) => {
//         setEditId(row.id)
//         setUnitName(row.unit_name)
//         setAbbreviation(row.abbreviation)
//         setBaseUnit(row.base_unit_id || '')
//         setConversion(row.universal_conversion || '')
//         setNotes(row.notes || '')
//       }
//     },
//     {
//       label: 'Delete',
//       icon: TrashIcon,
//       className: 'bg-red-500 text-white hover:bg-red-600 rounded-md',
//       onClick: (row) => {
//         dispatch(deleteUnitSlice(row.id)).then((result) => {
//           if (result.payload.success) {
//             toast.success('Unit deleted!')
//             dispatch(getUnitsSlice())
//           } else {
//             toast.error(result.payload.error)
//           }
//         })
//       }
//     }
//   ]

//   return (
//     <div className="h-screen flex gap-6 p-6">
//       <ToastContainer />

//       {/* --------------------------------- */}
//       {/* LEFT SIDE - FORM */}
//       {/* --------------------------------- */}
//       <div className="w-1/3 bg-white p-6 rounded-xl shadow-sm overflow-auto">
//         <PageHeading
//           title={editId ? 'Update Unit' : 'Create New Unit'}
//           subtitle="Define product measurement units"
//         />

//         <form onSubmit={editId ? handleUpdateUnit : handleCreateUnit}>
//           <InputField
//             label="Unit Name"
//             value={unitName}
//             placeholder="e.g. Box, Piece, Carton"
//             onChange={(e) => setUnitName(e.target.value)}
//             required
//           />

//           <InputField
//             label="Abbreviation"
//             value={abbreviation}
//             placeholder="e.g. BX, PC, CT"
//             onChange={(e) => setAbbreviation(e.target.value)}
//             required
//           />

//           <InputField
//             label="Notes"
//             value={notes}
//             placeholder="Additional comments"
//             onChange={(e) => setNotes(e.target.value)}
//           />

//           <ButtonFeild
//             className="h-11 mt-4"
//             type="submit"
//             label={editId ? 'Update Unit' : 'Add Unit'}
//           />
//         </form>
//       </div>

//       {/* --------------------------------- */}
//       {/* RIGHT SIDE - LIST TABLE */}
//       {/* --------------------------------- */}
//       <div className="w-2/3 bg-primary-light p-6 rounded-2xl shadow-sm flex flex-col">
//         <PageHeading title="Units List" subtitle="View, update or delete units" />

//         {/* <TableFeild columns={columns} data={units} actions={actions} /> */}
//         <SortableSimpleTable
//           actions={actions}
//           columns={columns}
//           data={units.map((u) => ({ ...u, id: String(u.id) }))}
//           setData={(newOrder) => {
//             // 1️⃣ Update local Redux state or local state
//             // For example, dispatch getUnitsSlice to refresh
//             dispatch(getUnitsSlice())

//             // 2️⃣ Extract sorted IDs
//             const sortedIds = newOrder.map((u) => u.id)

//             // 3️⃣ Persist new order via Electron IPC
//             window.api
//               .sortUnits(sortedIds)
//               .then((result) => {
//                 if (result.success) {
//                   console.log('Units reordered successfully')
//                   dispatch(getUnitsSlice()) // refresh from backend
//                 } else {
//                   console.error('Failed to reorder units:', result.error)
//                 }
//               })
//               .catch((err) => console.error('Sort units error:', err))
//           }}
//         />
//       </div>
//     </div>
//   )
// }
import React, { useState, useEffect } from 'react'
import InputField from '../components/InputFeild'
import ButtonFeild from '../components/ButtonFeild'
import PageHeading from '../components/PageHeading'
import TableFeild from '../components/TableFeild'
import { ToastContainer, toast } from 'react-toastify'
import SortableSimpleTable from '../components/SortableTable'
import { useDispatch, useSelector } from 'react-redux'
import {
  createUnitSlice,
  getUnitsSlice,
  updateUnitSlice,
  deleteUnitSlice,
  sortUnitsSlice,       // ← new
} from '../store/unitSlice'
import { PencilIcon, TrashIcon } from '@heroicons/react/24/solid'

export default function Unit() {
  const dispatch = useDispatch()
  const units    = useSelector((state) => state.unit.list)

  // Form fields
  const [unitName,      setUnitName]      = useState('')
  const [abbreviation,  setAbbreviation]  = useState('')
  const [baseUnit,      setBaseUnit]      = useState('')
  const [conversion,    setConversion]    = useState('')
  const [notes,         setNotes]         = useState('')
  const [editId,        setEditId]        = useState(null)

  // Load units on mount
  useEffect(() => {
    dispatch(getUnitsSlice({ search: '' }))
  }, [dispatch])

  // ── Reset form ────────────────────────────────────────────────────────────
  const resetForm = () => {
    setUnitName('')
    setAbbreviation('')
    setBaseUnit('')
    setConversion('')
    setNotes('')
    setEditId(null)
  }

  // ── Create ────────────────────────────────────────────────────────────────
  const handleCreateUnit = async (e) => {
    e.preventDefault()

    const result = await dispatch(createUnitSlice({
      unit_name:            unitName,
      abbreviation,
      base_unit_id:         baseUnit || null,
      universal_conversion: conversion || null,
      notes,
    })).unwrap()

    if (result.success) {
      toast.success('Unit created!')
      dispatch(getUnitsSlice())
      resetForm()
    } else {
      toast.error(result.error)
    }
  }

  // ── Update ────────────────────────────────────────────────────────────────
  const handleUpdateUnit = async (e) => {
    e.preventDefault()

    const result = await dispatch(updateUnitSlice({
      id: editId,
      data: {
        unit_name:            unitName,
        abbreviation,
        base_unit_id:         baseUnit || null,
        universal_conversion: conversion || null,
        notes,
      }
    })).unwrap()

    if (result.success) {
      toast.success('Unit updated!')
      dispatch(getUnitsSlice())
      resetForm()
    } else {
      toast.error(result.error)
    }
  }

  // ── Sort (drag-and-drop reorder) ──────────────────────────────────────────
  const handleSort = async (newOrder) => {
    const sortedIds = newOrder.map((u) => u.id)

    const result = await dispatch(sortUnitsSlice(sortedIds)).unwrap()

    if (result.success) {
      dispatch(getUnitsSlice())
    } else {
      console.error('Failed to reorder units:', result.error)
    }
  }

  // ── Table config ──────────────────────────────────────────────────────────
  const columns = [
    { label: 'Unit Name', accessor: 'unit_name' },
    { label: 'Abbrev',    accessor: 'abbreviation' },
  ]

  const actions = [
    {
      label: 'Edit',
      icon: PencilIcon,
      className: 'bg-primary-dark text-white hover:bg-blue-600 rounded-md',
      onClick: (row) => {
        setEditId(row.id)
        setUnitName(row.unit_name)
        setAbbreviation(row.abbreviation)
        setBaseUnit(row.base_unit_id || '')
        setConversion(row.universal_conversion || '')
        setNotes(row.notes || '')
      }
    },
    {
      label: 'Delete',
      icon: TrashIcon,
      className: 'bg-red-500 text-white hover:bg-red-600 rounded-md',
      onClick: async (row) => {
        const result = await dispatch(deleteUnitSlice(row.id)).unwrap()
        if (result.success) {
          toast.success('Unit deleted!')
          dispatch(getUnitsSlice())
        } else {
          toast.error(result.error)
        }
      }
    }
  ]

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="h-screen flex gap-6 p-6">
      <ToastContainer />

      {/* LEFT — FORM */}
      <div className="w-1/3 bg-white p-6 rounded-xl shadow-sm overflow-auto">
        <PageHeading
          title={editId ? 'Update Unit' : 'Create New Unit'}
          subtitle="Define product measurement units"
        />

        <form onSubmit={editId ? handleUpdateUnit : handleCreateUnit}>
          <InputField
            label="Unit Name"
            value={unitName}
            placeholder="e.g. Box, Piece, Carton"
            onChange={(e) => setUnitName(e.target.value)}
            required
          />
          <InputField
            label="Abbreviation"
            value={abbreviation}
            placeholder="e.g. BX, PC, CT"
            onChange={(e) => setAbbreviation(e.target.value)}
            required
          />
          <InputField
            label="Notes"
            value={notes}
            placeholder="Additional comments"
            onChange={(e) => setNotes(e.target.value)}
          />
          <ButtonFeild
            className="h-11 mt-4"
            type="submit"
            label={editId ? 'Update Unit' : 'Add Unit'}
          />
        </form>
      </div>

      {/* RIGHT — TABLE */}
      <div className="w-2/3 bg-primary-light p-6 rounded-2xl shadow-sm flex flex-col">
        <PageHeading title="Units List" subtitle="View, update or delete units" />

        <SortableSimpleTable
          actions={actions}
          columns={columns}
          data={units.map((u) => ({ ...u, id: String(u.id) }))}
          setData={handleSort}
        />
      </div>
    </div>
  )
}