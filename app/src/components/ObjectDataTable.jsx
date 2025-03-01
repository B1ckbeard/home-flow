//import React from 'react'
import { FaDeleteLeft } from "react-icons/fa6";

const ObjectDataTable = (data = [], onDelete) => {
  const safeData = Array.isArray(data) ? data.filter(item => item !== null) : [];
  const lastIndex = safeData.length - 1;
  return (
    <div>
      {safeData.length === 0 &&
        <p className="text-center">Список пуст</p>
      }
      {safeData.length !== 0 &&
        <div className="border-2 rounded border-slate-300">
          <table className="w-full">
            <thead className="border-b-2 rounded border-slate-300">
              <tr className="h-10">
                <th>Дата</th>
                <th className="text-amber-500">Эл-во</th>
                <th className="text-sky-500">Вода</th>
              </tr>
            </thead>
            <tbody className="text-center">
              {safeData.map((item, index) => {
                return (
                  <tr key={index} className="h-10">
                    <td>{item.date}</td>
                    <td>{item.el}</td>
                    <td>{item.water}</td>
                    <td className="h-10 flex items-center justify-center">
                      {index === lastIndex && (
                        <button
                          onClick={() => onDelete(item._id)}
                        >
                          <FaDeleteLeft className="size-8 fill-red-500" />
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
      }
    </div>
  )
}

export default ObjectDataTable
