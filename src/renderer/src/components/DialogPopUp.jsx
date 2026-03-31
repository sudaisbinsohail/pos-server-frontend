export default function DialogPopUp({ isOpen, onClose, title, children, className }) {
  if (!isOpen) return null
  return (
    <div className="fixed inset-0  bg-opacity-40 flex items-center justify-center z-50 ">
      <div className={`bg-primary-light rounded-lg shadow-xl m-20  p-10 relative ${className}`}>
        {/* Title */}
        <h2 className="text-xl font-bold mb-4 text-primary-dark">{title}</h2>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-10 right-10 text-white hover:text-red-200 cursor-pointer bg-red-600 w-7 h-7 rounded-full"
        >
          ✕
        </button>

        {/* Dynamic Form / Content */}
        {children}
      </div>
    </div>
  )
}
