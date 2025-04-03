import { useState, useEffect } from "react";
import axios from "axios";
import ObjectDataTable from "../components/ObjectDataTable";
import ObjectsListItem from "../components/ObjectsListItem";
import Header from "../components/Header";

const MainPage = () => {

  const [objectName, setObjectName] = useState('');
  const [objects, setObjects] = useState([]);
  const [currentObject, setCurrentObject] = useState({});
  const [date, setDate] = useState('');
  const [el, setEl] = useState('');
  //const [prevValues, setPrevValues] = useState({});
  const [water, setWater] = useState('');
  const [objectNameError, setObjectNameError] = useState(false);
  const [curData, setCurData] = useState([]);

  useEffect(() => {
    fetchObjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (currentObject && Object.keys(currentObject).length !== 0) {
      fetchObjIndications();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentObject]);

  const fetchObjects = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/objects');
      const objects = response.data;
      console.log('objects: ', objects);
      setObjects(objects);

      if (objects.length > 0) {
        if (Object.keys(currentObject).length === 0) {
          setCurrentObject(objects[0]);
        } else {
          setCurrentObject(objects.at(-1));
        }
      } else {
        console.log('Массив objects пуст');
      }
    } catch (error) {
      console.error('Ошибка при получении объектов:', error);
    }
  };

  const fetchObjIndications = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/api/objects/indications/${currentObject._id}`);
      console.log('indications: ', response.data);
      setCurData(response.data);
    } catch (error) {
      console.error('Ошибка при получении показаний:', error);
    }
  };

  const handleObjectNameChange = (e) => {
    setObjectName(e.target.value);
    setObjectNameError(false)
  };

  const handleDateChange = (e) => { setDate(e.target.value) };

  const handleElChange = (e) => { setEl(e.target.value) };

  const handleWaterChange = (e) => { setWater(e.target.value) };

  const handleTabClick = (e) => {
    const curObjName = e.target.textContent;
    const curObj = objects.find((el) => el.name === curObjName);
    if (curObj) {
      setCurrentObject(curObj);
    }
  };

  const handleObjectSave = async () => {
    if (objectName) {
      if (objects.includes(objectName)) {
        setObjectNameError(true);
      } else {
        setObjectNameError(false);
        await axios.post('http://localhost:3001/api/objects/save', { name: objectName });
        await fetchObjects();
        setObjectName('');
      }
    }
  };

  const handleObjectDelete = async () => {
    await axios.post(`http://localhost:3001/api/objects/delete/${currentObject._id}`);
    await fetchObjects();
    setCurrentObject(objects[0]);
  };

  /*
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
  */

  const handleSaveIndication = async () => {
    if (currentObject && date && el && water) {
      try {
        const objectId = currentObject._id
        const response = await axios.post('http://localhost:3001/api/indications/create', {
          date,
          el,
          water,
          objectId,
        });
        const newIndication = response.data;

        if (!newIndication || !newIndication._id) {
          throw new Error("Не удалось создать запись или получить её ID");
        }

        setEl('');
        setWater('');
        setDate('');

        console.log("Новая запись успешно создана и добавлена:", newIndication);
        fetchObjIndications();
      } catch (error) {
        console.error("Ошибка при сохранении показания:", error);
      }
    }
  }

  const handleDeleteIndication = async (id) => {
    await axios.post(`http://localhost:3001/api/indications/delete/${id}`);
    console.log(id, 'deleted')
    fetchObjIndications();
  };
  return (
    <>
      <Header />
      <div className="min-h-screen w-full flex flex-row items-center justify-center bg-gray-100">
        <div className="w-1/5 h-screen px-2 bg-white shadow-md pt-14">
          <div className="w-full flex flex-wrap items-center justify-center mb-2">
            <input
              className={`h-10 w-full p-1 mb-1 border rounded-md ${objectNameError ? 'border-red-400' : 'border-gray-400'}`}
              type="text"
              value={objectName}
              placeholder="Введите название"
              onChange={(e) => handleObjectNameChange(e)}
            />
            {objectNameError && <p className='text-black mt-1'>Объект с таким названием уже есть</p>}
            <button
              className="h-10 w-full rounded-md bg-gray-600 truncate text-white"
              onClick={handleObjectSave}
            >
              Добавить объект
            </button>
          </div>
          {objects.length === 0 &&
            <p className="text-center">Список пуст</p>
          }
          <div className="w-full flex flex-col items-center justify-center gap-1">
            {objects.map((obj, index) => (
              <li key={index} className="list-none w-full">
                {ObjectsListItem(obj, currentObject, handleTabClick, handleObjectDelete)}
              </li>
            ))}
          </div>
        </div>
        <div className="w-4/5 h-screen pl-4 pt-10">
          <div className="h-full bg-white pt-4 shadow-md">
            {objects.length > 0 &&
              <div className="w-full flex flex-col justify-center">
                <div className="flex items-center justify-center mb-1">
                  <input
                    className="h-10 p-1 mr-1 border rounded border-gray-400"
                    type="date"
                    value={date}
                    placeholder='Дата'
                    onChange={(e) => handleDateChange(e)}
                  />
                  <input
                    className="h-10 p-1 mr-1 border rounded border-gray-400"
                    type="number"
                    value={el}
                    placeholder="Эл-во"
                    onChange={(e) => handleElChange(e)}
                  />
                  <input
                    className="h-10 p-1 mr-1 border rounded border-gray-400"
                    type="number"
                    value={water}
                    placeholder="Вода"
                    onChange={(e) => handleWaterChange(e)}
                  />
                  <button
                    className="h-10 px-2 rounded-md bg-gray-600 text-white"
                    onClick={handleSaveIndication}
                  >
                    Добавить
                  </button>
                </div>
                {Object.keys(currentObject).length !== 0 && (
                  ObjectDataTable(Array.isArray(curData) ? curData : [], handleDeleteIndication)
                )}
              </div>
            }
          </div>
        </div>
      </div>
    </>
  )
}

export default MainPage
