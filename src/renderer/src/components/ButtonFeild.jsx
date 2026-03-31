export default function ButtonFeild({ label, onClick, type = 'button', className = '' }) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`bg-primary-dark text-white py-2 px-4 rounded-md hover:bg-white hover:border-primary-dark hover:text-primary-dark hover:border-2 mt-5 w-full ${className} cursor-pointer`}
    >
      {label}
    </button>
  )
}
