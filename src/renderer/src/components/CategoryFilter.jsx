import { useEffect, useRef, useState } from "react";

export default function CategoryDropdown({
  categories = [],
  value,
  onChange,
  label = "Filter by Category",
}) {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const [stack, setStack] = useState([]);
  const dropdownRef = useRef(null);

  // Initialize root options
  useEffect(() => {
    setOptions(categories);
  }, [categories]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        resetDropdown();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const resetDropdown = () => {
    setOpen(false);
    setOptions(categories);
    setStack([]);
  };

  // Drill down or select
  const handleSelect = (opt) => {
    // ALL CATEGORIES
    if (opt.value === "") {
      onChange("");
      resetDropdown();
      return;
    }

    // Has subcategories → drill down
    if (opt.subCategories?.length > 0) {
      setStack((prev) => [...prev, options]);
      setOptions(opt.subCategories);
      return;
    }

    // Last-level subcategory → select
    onChange(opt.id);
    resetDropdown();
  };

  // Go back in the stack
  const handleBack = () => {
    const prev = stack[stack.length - 1];
    if (!prev) return;
    setOptions(prev);
    setStack((s) => s.slice(0, -1));
  };

  // Recursively find category name by ID
  const findCategoryName = (id, list) => {
    for (const c of list) {
      if (c.id === id) return c.categoryName;
      if (c.subCategories?.length) {
        const name = findCategoryName(id, c.subCategories);
        if (name) return name;
      }
    }
    return null;
  };

  const selectedLabel = value ? findCategoryName(value, categories) || "All Categories" : "All Categories";

  return (
    <div ref={dropdownRef} className="relative w-full pt-2 pb-2">
      <label className="text-sm font-medium text-primary-dark">{label}</label>

      {/* Trigger */}
      <div
        onClick={() => setOpen((o) => !o)}
        className="mt-1 flex justify-between items-center border rounded-md bg-white px-3 py-2 cursor-pointer"
      >
        <span className={value ? "" : "text-gray-400"}>{selectedLabel}</span>
        <span>▾</span>
      </div>

      {/* Dropdown */}
      {open && (
        <div className="absolute z-30 mt-1 w-full bg-white border rounded-md shadow-lg max-h-64 overflow-y-auto">
          {/* ALL CATEGORIES */}
          <div
            onClick={() => handleSelect({ id: "", categoryName: "All Categories", subCategories: [] })}
            className={`px-3 py-2 cursor-pointer hover:bg-gray-100 ${
              !value ? "bg-blue-100 font-medium" : ""
            }`}
          >
            All Categories
          </div>

          {/* BACK */}
          {stack.length > 0 && (
            <div
              onClick={handleBack}
              className="px-3 py-2 text-sm cursor-pointer text-blue-600 hover:bg-gray-100"
            >
              ← Back
            </div>
          )}

          {/* OPTIONS */}
          {options.map((opt) => (
            <div
              key={opt.id}
              onClick={() => handleSelect(opt)}
              className="px-3 py-2 cursor-pointer hover:bg-gray-100 flex justify-between"
            >
              <span>{opt.categoryName}</span>
              {opt.subCategories?.length > 0 && <span className="text-gray-400">›</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}



