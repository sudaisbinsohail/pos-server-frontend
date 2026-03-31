

import { useState, useRef, useEffect } from 'react'

export default function DropdownFeild({
  label,
  options = [],
  value,
  onChange,
  placeholder = 'Select an option',
  className = '',
  searchable = false,
  allowCustom = true // NEW
}) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [highlightIndex, setHighlightIndex] = useState(0)
  const [internalOptions, setInternalOptions] = useState(options)

  const dropdownRef = useRef(null)
  const inputRef = useRef(null)
  const optionRefs = useRef([])

  // ⭐ Selected item stays on top
  const sortedOptions = [...internalOptions].sort((a, b) => {
    if (a === value) return -1
    if (b === value) return 1
    return 0
  })

  const filteredOptions = searchable
    ? sortedOptions.filter((opt) => opt.toLowerCase().includes(search.toLowerCase()))
    : sortedOptions

  const handleSelect = (option) => {
    onChange(option)
    setOpen(false)
    setSearch('')
    setHighlightIndex(0)
  }

  // 📌 Click outside to close
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // 🎹 Keyboard Navigation
  const handleKeyDown = (e) => {
    if (!open) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setHighlightIndex((prev) => (prev + 1 < filteredOptions.length ? prev + 1 : prev))
        break

      case 'ArrowUp':
        e.preventDefault()
        setHighlightIndex((prev) => (prev - 1 >= 0 ? prev - 1 : 0))
        break

      case 'Enter':
        e.preventDefault()

        // Press Enter to add custom value
        if (allowCustom && filteredOptions.length === 0 && search.trim() !== '') {
          const newItem = search.trim()
          setInternalOptions((prev) => [...prev, newItem])
          handleSelect(newItem)
          return
        }

        handleSelect(filteredOptions[highlightIndex])
        break

      case 'Escape':
        setOpen(false)
        break
    }
  }

  // 🔥 Auto-scroll to highlighted item
  useEffect(() => {
    if (open && optionRefs.current[highlightIndex]) {
      optionRefs.current[highlightIndex].scrollIntoView({
        behavior: 'smooth',
        block: 'nearest'
      })
    }
  }, [highlightIndex, open])

  // Focus search when dropdown opens
  useEffect(() => {
    if (searchable && open) {
      inputRef.current?.focus()
    }
  }, [open])

  return (
    <div
      ref={dropdownRef}
      className={`relative gap-2 pt-2 pb-2 w-full ${className}`}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      {label && <label className="text-sm text-primary-dark font-medium">{label}</label>}

      {/* BUTTON */}
      <div
        onClick={() => setOpen(!open)}
        className="
          flex items-center justify-between w-full 
          border rounded-md bg-white px-3 py-2 mt-1
          cursor-pointer text-gray-800
        "
      >
        <span className={`${value ? '' : 'text-gray-400'}`}>{value || placeholder}</span>

        <svg
          className={`w-4 h-4 text-gray-500 transition-transform ${open ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {/* DROPDOWN */}
      {open && (
        <div
          className="
            absolute mt-1 w-full bg-white 
            border border-gray-200 rounded-lg shadow-md 
            z-20 max-h-70 overflow-y-auto
          "
        >
          {/* SEARCH INPUT */}
          {searchable && (
            <div className="p-2 border-b border-gray-200">
              <input
                ref={inputRef}
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value)
                  setHighlightIndex(0)
                }}
                placeholder="Search..."
                className="w-full px-3 py-2 border border-primary rounded-md text-sm"
              />
            </div>
          )}

          {/* OPTIONS LIST */}
          {filteredOptions.length > 0 ? (
            filteredOptions.map((opt, idx) => (
              <div
                key={idx}
                ref={(el) => (optionRefs.current[idx] = el)}
                onClick={() => handleSelect(opt)}
                className={`
                  px-3 py-2 cursor-pointer
                  ${
                    opt === value
                      ? 'bg-primary text-white'
                      : idx === highlightIndex
                      ? 'bg-primary/50 text-white'
                      : 'hover:bg-gray-100 text-gray-700'
                  }
                `}
              >
                {opt}
              </div>
            ))
          ) : (
            <div
              className="px-3 py-2 text-gray-500 text-sm cursor-pointer"
              onClick={() => {
                if (allowCustom && search.trim()) {
                  const newItem = search.trim()
                  setInternalOptions((prev) => [...prev, newItem])
                  handleSelect(newItem)
                }
              }}
            >
              {allowCustom ? `Add "${search}"` : 'No results found'}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
