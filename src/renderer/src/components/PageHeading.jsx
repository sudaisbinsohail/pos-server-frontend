export default function PageHeading({ title, subtitle = '', className = '' }) {
  return (
    <div className={`flex flex-col gap-1 pb-1 ${className}`}>
      <h1 className="text-2xl font-bold text-primary-dark pb-1">{title}</h1>

      {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
    </div>
  )
}
