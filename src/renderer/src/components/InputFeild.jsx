export default function InputField({
  label,
  value,
  onChange,
  type = 'text',
  placeholder = '',
  required = false,
  className = ''
}) {
  return (
    <div className="flex flex-col gap-2 pt-2 pb-2 w-full">
      {label && <label className="text-sm  text-primary-dark font-medium">{label}</label>}

      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={
          ' border rounded-md p-2 text-text-dark outline-none placeholder-text-light bg-white  ' +
          className
        }
      />
    </div>
  )
}
