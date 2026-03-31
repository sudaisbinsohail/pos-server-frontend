import { DndContext, closestCenter } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable'
import SortableRow from './SortableRow' // should render <tr>
import IconButton from './IconButton'

export default function SortableTable({ columns = [], data = [], setData, actions = [] }) {
  const handleDragEnd = ({ active, over }) => {
    if (!over || active.id === over.id) return

    const oldIndex = data.findIndex((row) => row.id === active.id)
    const newIndex = data.findIndex((row) => row.id === over.id)

    const newData = arrayMove(data, oldIndex, newIndex)
    setData(newData)
  }

  return (
    <div className="overflow-x-auto mt-5">
      <DndContext onDragEnd={handleDragEnd} collisionDetection={closestCenter}>
        <SortableContext items={data.map((r) => r.id)} strategy={verticalListSortingStrategy}>
          <table className="w-full border-collapse bg-white shadow-sm">
            <thead className="sticky top-0 bg-gray-50 z-10">
              <tr>
                <th className="px-4 py-2 text-left ">::</th>
                {columns.map((col, i) => (
                  <th
                    key={i}
                    className={`px-4 py-2 text-sm font-semibold text-gray-700 ${
                      col.center ? 'text-center' : 'text-left'
                    }`}
                  >
                    {col.label}
                  </th>
                ))}
                {actions.length > 0 && (
                  <th className="px-4 py-2 text-center text-gray-700">Actions</th>
                )}
              </tr>
            </thead>

            <tbody>
              {data.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length + (actions.length > 0 ? 2 : 1)}
                    className="px-4 py-2 text-center text-gray-500  "
                  >
                    No data found
                  </td>
                </tr>
              ) : (
                data.map((row, idx) => (
                  <SortableRow key={row.id} id={row.id}>
                    {/* Drag handle */}
                    <td key="drag-handle" className="px-4 py-2 cursor-grab w-[40px] text-centerr">
                      ::
                    </td>

                    {/* Data columns */}
                    {columns.map((col, i) => (
                      <td key={i} className="px-4 py-2 border-b-1 border-gray-300 ">
                        <div className="bg-white  p-3 flex items-center justify-between transition">
                          <div className="flex items-center space-x-3">
                            {/* Optional icon */}
                            {row.icon && <img src={row.icon} alt="" className="w-6 h-6" />}
                            {/* Text */}
                            <div>
                              <div className="text-lg font-semibold text-gray-900">
                                {col.render ? col.render(row) : row[col.accessor]}
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>
                    ))}

                    {/* Actions */}
                    {actions.length > 0 && (
                      <td className="px-4 py-2 text-center border-b-1 border-gray-300">
                        <div className="flex justify-center gap-2">
                          {actions.map((action, i) => (
                            <IconButton
                              key={i}
                              icon={action.icon}
                              label={action.label}
                              onClick={() => action.onClick(row)}
                              className={action.className}
                            />
                          ))}
                        </div>
                      </td>
                    )}
                  </SortableRow>
                ))
              )}
            </tbody>
          </table>
        </SortableContext>
      </DndContext>
    </div>
  )
}
