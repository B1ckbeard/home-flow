import { useState, useEffect } from "react";
import axios from "axios";
import ObjectDataTable from "./components/ObjectDataTable";
import ObjectsListItem from "./components/ObjectsListItem";

const App = () => {
  const [objectName, setObjectName] = useState('');
  const [objects, setObjects] = useState([]);
  const [currentObject, setCurrentObject] = useState('');
  const [date, setDate] = useState('');
  const [el, setEl] = useState('');
  const [prevValues, setPrevValues] = useState({});
  const [water, setWater] = useState('');
  const [data, setData] = useState([]);
  const [objectNameError, setObjectNameError] = useState(false);
  const [curData, setCurData] = useState([]);

  useEffect(() => {
    fetchObjects();
    fetchIndications();
  }, []);

  const fetchObjects = async () => {
    const response = await axios.get('http://localhost:3001/api/objects');
    console.log(response.data);
    setObjects(response.data);
    setCurrentObject(response.data[0].name);
  };

  const fetchIndications = async () => {
    const response = await axios.get('http://localhost:3001/api/indications');
    console.log(response.data);
  };

  const handleObjectNameChange = (e) => {
    setObjectName(e.target.value);
    setObjectNameError(false)
  };

  const handleDateChange = (e) => {
    setDate(e.target.value);
  };

  const handleElChange = (e) => {
    setEl(e.target.value);
  };

  const handleWaterChange = (e) => {
    setWater(e.target.value);
  };

  const handleTabClick = (e) => {
    const curObjName = e.target.textContent
    setCurrentObject(curObjName);
  };

  const handleSave = () => {
    if (currentObject && date && el && water) {
      const prevEl = prevValues[currentObject]?.el || el;
      const prevWater = prevValues[currentObject]?.water || water;
      if (el !== prevEl) {
        console.log(`Объект: ${currentObject}, Предыдущее значение el: ${prevEl}, Текущее значение el: ${el}`);
      }
      if (water !== prevWater) {
        console.log(`Объект: ${currentObject}, Предыдущее значение water: ${prevWater}, Текущее значение water: ${water}`);
      }
      const newData = [...data, { name: currentObject, date, el, water, 'diffEl': el - prevEl, 'diffWater': water - prevWater }];
      setData(newData);
      
      setPrevValues({
        ...prevValues,
        [currentObject]: { el, water },
      });
      console.log(prevValues);
      
      setEl('');
      setWater('');
      setDate('');
    }
  };

  const handleItemDelete = (index) => {
    const newData = data.filter((_, i) => i !== index);
    setData(newData);
  };

  const handleObjectSave = async () => {
    if (objectName) {
      if (objects.includes(objectName)) {
        setObjectNameError(true);
      } else {
        setObjectNameError(false);
        await axios.post('http://localhost:3001/api/objects/save', { name: objectName });
        await fetchObjects();
        setCurrentObject(objectName);
        setObjectName('');
      }
    }
  };

  const handleObjectDelete = async () => {
    const curObjId = objects.find((el) => el.name === currentObject)._id;
    await axios.post(`http://localhost:3001/api/objects/delete/${curObjId}`);
    fetchObjects();
  };

  const filterCurData = () => {
    const filteredData = data.filter(item => item.name === currentObject);
    setCurData(filteredData);
  }

  useEffect(() => {
    filterCurData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentObject, data]);

  return (
    <>
      <div className="min-h-screen w-full flex flex-row items-center justify-center
      bg-gradient-to-r from-slate-400 via-slate-300 to-slate-400 py-3">
        <div className="w-1/5 h-screen border-2 rounded border-gray-400 mr-2">
          <div className="h-20 top-0 w-full flex flex-wrap items-center justify-center p-2 mb-6">
            <input
              className={`h-10 w-full p-1 mb-1 border-2 rounded ${objectNameError ? 'border-red-400' : 'border-gray-400'}`}
              type="text"
              value={objectName}
              placeholder="Введите название"
              onChange={(e) => handleObjectNameChange(e)}
            />
            {objectNameError && <p className='text-black mt-1'>Объект с таким названием уже есть</p>}
            <button
              className="h-10 w-full p-1 border-2 rounded border-slate-400 bg-slate-200 truncate"
              onClick={handleObjectSave}
            >
              Добавить объект
            </button>
          </div>
          <div className="w-full flex flex-col items-center justify-center gap-1 px-2">
            {objects.map((obj, index) => (
              <li key={index} className="list-none w-full">
                {ObjectsListItem(obj, currentObject, handleTabClick, handleObjectDelete)}
              </li>
            ))}
          </div>
        </div>
        <div className="w-4/5 h-screen border-2 rounded border-slate-400">
          {objects.length === 0 &&
            <p className="text-center mt-2">Список пуст</p>
          }
          {objects.length > 0 &&
            <div className="mb-5 p-2 w-full flex flex-col justify-center">
              <div className="flex items-center justify-center mb-2">
                <input
                  className="h-10 p-1 mr-2 border-2 rounded border-slate-300"
                  type="date"
                  value={date}
                  placeholder='Дата'
                  onChange={(e) => handleDateChange(e)}
                />
                <input
                  className="h-10 p-1 mr-2 border-2 rounded border-slate-300"
                  type="number"
                  value={el}
                  placeholder="Эл-во"
                  onChange={(e) => handleElChange(e)}
                />
                <input
                  className="h-10 p-1 mr-2 border-2 rounded border-slate-300"
                  type="number"
                  value={water}
                  placeholder="Вода"
                  onChange={(e) => handleWaterChange(e)}
                />
                <button
                  className="h-10 p-1 border-2 rounded border-slate-300 bg-slate-100"
                  onClick={handleSave}
                >
                  Добавить
                </button>
              </div>
              {ObjectDataTable(curData, handleItemDelete)}
            </div>
          }
        </div>
      </div>
    </>
  )
}

export default App
