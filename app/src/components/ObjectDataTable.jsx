//import React from 'react'
import { FaDeleteLeft } from "react-icons/fa6";

const ObjectDataTable = (data, onDelete) => {
  const lastIndex = data.length - 1;
  return (
    <div className="mb-3 p-2 border-2 rounded border-slate-300">
      <table className="w-full">
        <thead className="border rounded border-slate-300">
          <tr>
            <th>Дата</th>
            <th className="text-amber-500">Эл-во</th>
            <th className="text-sky-500">Вода</th>
            <th>Водоотведение</th>
            <th>Расход эл</th>
            <th>Расход вс</th>
            <th>Сумма</th>
          </tr>
        </thead>
        <tbody className="text-center">
          {data.map((item, index) => {
              return (
                <tr key={index}>
                  <td>{item.date}</td>
                  <td>{item.el}</td>
                  <td>{item.water}</td>
                  <td>{item.water}</td>
                  <td>{item.diffEl}</td>
                  <td>{item.diffWater}</td>
                  <td>{item.diffWater * 50 + item.diffEl * 6}</td>
                  <td>
                    {index === lastIndex && (
                      <button
                        onClick={() => onDelete(index)}
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
