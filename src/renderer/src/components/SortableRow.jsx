import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import React from 'react'

export default function SortableRow({ id, children }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id })
  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  }

  return (
    <tr ref={setNodeRef} style={style}>
      {React.Children.map(children, (child) => {
        // Attach drag listeners only to the drag handle cell
        if (child.key === 'drag-handle') {
          return React.cloneElement(child, { ...attributes, ...listeners })
        }
        return child
      })}
    </tr>
  )
}
