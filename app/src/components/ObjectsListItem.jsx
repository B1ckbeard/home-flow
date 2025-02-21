//import React from 'react'
import { MdDeleteForever } from "react-icons/md";

const ObjectsListItem = (obj, curObj, onClick, onDelete) => {
  return (
    <div
      onClick={(e) => onClick(e)}
      className={`h-10 w-full cursor-pointer truncate border-2 rounded flex items-center px-1
        ${obj.name === curObj ? 'justify-between  border-slate-400 bg-slate-50' :
        'border-slate-500 bg-slate-400'}`
      }
    >
      {obj.name}
      {obj.name === curObj &&
        <button
          onClick={onDelete}
        >
          <MdDeleteForever className="size-8 fill-red-500" />
        </button>
      }
    </div>
  )
}

export default ObjectsListItem
