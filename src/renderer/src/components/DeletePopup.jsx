import React from 'react'

export default function DeletePopup({ open, onClose, onConfirm, itemName }) {
  if (!open) return null

  return (
    <div className="fixed inset-0  bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-primary-light p-5 rounded-md shadow-md w-120">
        <h2 className="text-lg font-semibold mb-3 text-center">Confirm Delete</h2>

        <p className="text-center text-gray-600 mb-5">
          Are you sure you want to delete <b>{itemName}</b>?
        </p>

        <div className="flex justify-between">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400">
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}
