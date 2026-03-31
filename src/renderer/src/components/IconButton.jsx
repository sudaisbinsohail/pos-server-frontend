import React from 'react'

export default function IconButton({ icon: Icon, label, onClick, className }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1 px-2 py-1 text-xs  shadow-sm hover:shadow-md cursor-pointer transition ${className}`}
    >
      {Icon && <Icon className="w-4 h-4" />}
      {label && <span>{label}</span>}
    </button>
  )
}
