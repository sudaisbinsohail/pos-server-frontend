import { ChevronRightIcon } from '@heroicons/react/24/solid'

function Breadcrumbs({ items, onClick }) {
  return (
    <nav className="flex items-center text-xl text-bold text-gray-500 mb-4 p-2">
      {items.map((item, idx) => {
        const isLast = idx === items.length - 1 // last item = current page
        return (
          <div key={idx} className="flex items-center">
            {idx !== 0 && <ChevronRightIcon className="w-4 h-4 mx-2 text-gray-400" />}

            {isLast ? (
              <span className="text-gray-800 font-medium">{item.label}</span>
            ) : (
              <button onClick={() => onClick(item, idx)} className="hover:text-gray-800 transition">
                {item.label}
              </button>
            )}
          </div>
        )
      })}
    </nav>
  )
}

export default Breadcrumbs
