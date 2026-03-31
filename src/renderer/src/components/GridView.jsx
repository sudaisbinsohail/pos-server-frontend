import { useState, useEffect } from 'react'
import IconButton from './IconButton'
import { PencilIcon, TrashIcon } from '@heroicons/react/24/solid'

export default function GridView({ data, onOpen, onEdit, onDelete }) {
  const [imageMap, setImageMap] = useState({})

  useEffect(() => {
    data.forEach((item) => {
      if (item.imageUrl) {
        window.api.readImageBase64(item.imageUrl).then((base64) => {
          setImageMap((prev) => {
            if (prev[item.id] !== base64) {
              return { ...prev, [item.id]: base64 }
            }
            return prev
          })
        })
      } else {
        setImageMap((prev) => ({ ...prev, [item.id]: null }))
      }
    })
  }, [data])

  return (
    <div className="h-screen overflow-auto">
      {data.length === 0 ? (
        <p className="text-center text-gray-500">No categories found</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {data.map((item) => (
            <div
              key={`${item.id}-${item.imageUrl}`} // key updates if imageUrl changes
              onClick={() => onOpen?.(item)}
              className="group bg-white shadow-md hover:shadow-xl rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1"
            >
              {/* Image */}
              <div className="w-full h-36 bg-gray-100 overflow-hidden flex items-center justify-center">
                {item.imageUrl ? (
                  imageMap[item.id] ? (
                    <img
                      src={imageMap[item.id]}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <span className="text-gray-400 text-xs">Loading...</span>
                  )
                ) : (
                  <span className="text-gray-400 text-xs">No Image</span>
                )}
              </div>

              {/* Content */}
              <div>
                <div className="p-4">
                  <h3 className="text-sm font-semibold text-gray-800 truncate">
                    {item.categoryName}
                  </h3>

                  <p className="text-xs text-gray-500 mt-1">
                    
                    {item.subCategories?.length || 0} Sub Category
                  </p>
                </div>

                <div className="mt-4 flex w-full">
                  <IconButton
                    icon={PencilIcon}
                    label="Edit"
                    className="w-1/2 h-10 bg-primary-dark text-white hover:bg-blue-600 rounded-bl-xl rounded-br-none"
                    onClick={(e) => {
                      e.stopPropagation()
                      onEdit(item)
                    }}
                  />

                  <IconButton
                    icon={TrashIcon}
                    label="Delete"
                    className="w-1/2 h-10 bg-red-500 text-white hover:bg-red-600 rounded-br-xl rounded-bl-none"
                    onClick={(e) => {
                      e.stopPropagation()
                      onDelete(item)
                    }}
                  />
                </div>
              </div>

              {/* Open badge */}
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition">
                <span className="px-3 py-1 text-[10px] bg-black/60 text-white rounded-full">
                  Open
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
