import IconButton from "./IconButton"

export default function TableFeild({ columns, data, actions }) {
  return (
    <div className="overflow-x-auto mt-5">
      <div className="">
        {/* overflow-y-auto h-[calc(100vh-270px)] */}
        <table className="w-full border-collapse">
          {/* HEADER */}
          <thead className="sticky top-0 bg-white shadow-sm z-10">
            <tr>
              {columns.map((col, i) => (
                <th
                  key={i}
                  className={`px-4 py-2 text-sm font-semibold text-gray-700 ${col.center ? "text-center" : "text-left"}`}
                >
                  {col.label}
                </th>
              ))}
              {actions && (
                <th className="px-4 py-2 text-sm font-semibold text-center text-gray-700">
                  Actions
                </th>
              )}
            </tr>
          </thead>

          {/* BODY */}
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (actions ? 1 : 0)}
                  className="px-4 py-2 text-center text-gray-500 bg-white"
                >
                  No data found
                </td>
              </tr>
            ) : (
              data.map((row, idx) => (
                <tr
                  key={idx}
                  className="bg-white transition-all duration-300 hover:bg-primary-light border-b  border-primary-dark" // <-- added border-b
                >
                  {columns.map((col, i) => (
                    <td
                      key={i}
                      className={`px-4 py-2 text-sm ${col.center ? "text-center" : "text-left"}`}
                    >
                      {col.render ? col.render(row) : row[col.accessor]}
                    </td>
                  ))}

                   {actions && (
                    <td className="px-4 py-2 text-center">
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
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
