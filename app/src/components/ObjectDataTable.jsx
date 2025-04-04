//import React from 'react'
import { FaDeleteLeft } from "react-icons/fa6";

const ObjectDataTable = (data = [], onDelete) => {
  const safeData = Array.isArray(data) ? data.filter(item => item !== null) : [];
  const lastIndex = safeData.length - 1;
  return (
    <div className="px-3">
      {safeData.length === 0 &&
        <p className="text-center mb-2">Список пуст</p>
      }
      {safeData.length !== 0 &&
        <div className="border border-gray-400 rounded">
          <table className="w-full">
            <thead className="border-b border-gray-400 rounded">
              <tr className="h-10">
                <th>Дата</th>
                <th>Эл-во</th>
                <th>Вода</th>
                <th>Расход эл-ва</th>
                <th>Расход воды</th>
              </tr>
            </thead>
            <tbody className="text-center">
              {safeData.map((item, index) => {
                return (
                  <tr key={index} className="h-10">
                    <td>{item.date}</td>
                    <td>{item.el}</td>
                    <td>{item.water}</td>
                    <td>Расход эл-ва</td>
                    <td>Расход воды</td>
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
