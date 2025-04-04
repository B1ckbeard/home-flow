//import React from 'react'
import { MdDeleteForever } from "react-icons/md";

const ObjectsListItem = (obj, curObj, onClick, onDelete) => {
  return (
    <div
      onClick={(e) => onClick(e)}
      className={`h-10 w-full cursor-pointer truncate rounded flex items-center px-1 border border-gray-400 hover:bg-gray-200
        ${obj.name === curObj.name ? 'justify-between bg-gray-300' : 'bg-transparent'}`
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
