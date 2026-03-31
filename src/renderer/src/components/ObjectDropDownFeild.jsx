import { useState, useRef, useEffect } from "react";

export default function ObjectDropDownFeild({
  label,
  options = [], // [{ label: "All Categories", value: "" }, { label: "Fruits", value: 1 }]
  value, // the selected value (e.g., category ID)
  onChange, // function to update selected value
  placeholder = "Select an option",
  className = "",
  searchable = false,
  allowCustom = false, // allow adding new custom string (optional)
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [highlightIndex, setHighlightIndex] = useState(0);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);
  const optionRefs = useRef([]);

  // Filter options based on search
  const filteredOptions = searchable
    ? options.filter((opt) =>
        opt.label.toLowerCase().includes(search.toLowerCase())
      )
    : options;

  const selectedOption = options.find((opt) => opt.value === value);

  const handleSelect = (opt) => {
    onChange(opt.value);
    setOpen(false);
    setSearch("");
    setHighlightIndex(0);
  };

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (!open) return;
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightIndex((prev) =>
          prev + 1 < filteredOptions.length ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightIndex((prev) => (prev - 1 >= 0 ? prev - 1 : 0));
        break;
      case "Enter":
        e.preventDefault();
        if (filteredOptions[highlightIndex]) {
          handleSelect(filteredOptions[highlightIndex]);
        } else if (allowCustom && search.trim()) {
          const newItem = { label: search.trim(), value: search.trim() };
          handleSelect(newItem);
        }
        break;
      case "Escape":
        setOpen(false);
        break;
    }
  };

  // Scroll to highlighted option
  useEffect(() => {
    if (open && optionRefs.current[highlightIndex]) {
      optionRefs.current[highlightIndex].scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [highlightIndex, open]);

  // Focus input when dropdown opens
  useEffect(() => {
    if (searchable && open) inputRef.current?.focus();
  }, [open]);

  return (
    <div
      ref={dropdownRef}
      className={`relative w-full ${className} pt-2 pb-2`}
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      {label && <label className="text-sm font-medium text-primary-dark">{label}</label>}

      {/* Dropdown button */}
      <div
        onClick={() => setOpen(!open)}
        className="flex justify-between items-center border rounded-md bg-white px-3 py-2 mt-1 cursor-pointer text-gray-800"
      >
        <span className={`${selectedOption ? "" : "text-gray-400"}`}>
          {selectedOption?.label || placeholder}
        </span>
        <svg
          className={`w-4 h-4 text-gray-500 transition-transform ${
            open ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>

      {/* Dropdown options */}
      {open && (
        <div className="absolute mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg z-20 max-h-60 overflow-y-auto">
          {/* Search input */}
          {searchable && (
            <div className="p-2 border-b border-gray-200">
              <input
                ref={inputRef}
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setHighlightIndex(0);
                }}
                placeholder="Search..."
                className="w-full px-3 py-2 border rounded-md text-sm"
              />
            </div>
          )}

          {/* Options list */}
          {filteredOptions.length > 0 ? (
            filteredOptions.map((opt, idx) => (
              <div
                key={opt.value}
                ref={(el) => (optionRefs.current[idx] = el)}
                onClick={() => handleSelect(opt)}
                className={`px-3 py-2 cursor-pointer ${
                  opt.value === value
                    ? "bg-blue-500 text-white"
                    : idx === highlightIndex
                    ? "bg-blue-200 text-black"
                    : "hover:bg-gray-100 text-gray-700"
                }`}
              >
                {opt.label}
              </div>
            ))
          ) : (
            <div
              className="px-3 py-2 text-gray-500 cursor-pointer"
              onClick={() => {
                if (allowCustom && search.trim()) {
                  const newItem = { label: search.trim(), value: search.trim() };
                  handleSelect(newItem);
                }
              }}
            >
              {allowCustom ? `Add "${search}"` : "No results found"}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
