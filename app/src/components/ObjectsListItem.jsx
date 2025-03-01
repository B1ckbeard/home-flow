//import React from 'react'
import { MdDeleteForever } from "react-icons/md";

const ObjectsListItem = (obj, curObj, onClick, onDelete) => {
  return (
    <div
      onClick={(e) => onClick(e)}
      className={`h-10 w-full cursor-pointer truncate border-2 rounded flex items-center px-1
        ${obj.name === curObj.name ? 'justify-between  border-slate-400 bg-slate-50' :
        'border-slate-400 bg-slate-300'}`
      }
    >
      {obj.name}
      {obj.name === curObj.name &&
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
