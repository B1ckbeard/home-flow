//import React from 'react'
import { FaDeleteLeft } from "react-icons/fa6";

const ObjectDataTable = (data = [], onDelete) => {
  const safeData = Array.isArray(data) ? data.filter(item => item !== null) : [];
  const lastIndex = safeData.length - 1;
  return (
    <div className="mb-3 p-2 border-2 rounded border-slate-300">
      <table className="w-full">
        <thead className="border rounded border-slate-300">
          <tr>
            <th>Дата</th>
            <th className="text-amber-500">Эл-во</th>
            <th className="text-sky-500">Вода</th>
          </tr>
        </thead>
        <tbody className="text-center">
          {safeData.map((item, index) => {
              return (
                <tr key={index}>
                  <td>{item.date}</td>
                  <td>{item.el}</td>
                  <td>{item.water}</td>
                  <td>
                    {index === lastIndex && (
                      <button
                        onClick={() => onDelete(item._id)}
                      >
                        <FaDeleteLeft className="mt-1 size-8 fill-red-500" />
                      </button>
                    )}
                  </td>
                </tr>
              );
            }
          )}
        </tbody>
      </table>
    </div>
  )
}

export default ObjectDataTable
