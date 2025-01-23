import { useState, useEffect } from "react";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

const App = () => {
  const [objectName, setObjectName] = useState('');
  const [objects, setObjects] = useState([]);
  const [currentObject, setCurrentObject] = useState('');
  const [date, setDate] = useState('');
  const [el, setEl] = useState('');
  const [prevValues, setPrevValues] = useState({});
  const [water, setWater] = useState('');
  const [data, setData] = useState([]);

  const handleObjectNameChange = (e) => {
    setObjectName(e.target.value);
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
      setData([...data, { name: currentObject, date, el, water, 'diffEl': el-prevEl, 'diffWater': water-prevWater }]);
      setPrevValues({
        ...prevValues,
        [currentObject]: { el, water },
      });
      console.log(prevValues);
      // Сброс текущих значений
      setEl('');
      setWater('');
      setDate('');
    }
  };

  const handleObjectSave = () => {
    if (objectName) {
      setObjects([...objects, objectName]);
      if (currentObject === '') {
        setCurrentObject(objectName);
      }
      setObjectName('');
    }
  };

  useEffect(() => {
    console.log(data);
  }, [data]);

  useEffect(() => {
    console.log(objects);
  }, [objects]);


  return (
    <>
      <div className="container grid w-screen justify-center pt-10">
        <div className="mb-5 sticky w-full top-0 flex justify-center">
          <input
            className="h-10 w-36 p-1 mr-2 border-2 rounded border-gray-400"
            type="text"
            value={objectName}
            placeholder="Введите название"
            onChange={(e) => handleObjectNameChange(e)}
          />
          <button
            className="h-10 w-36 p-1 border-2 rounded border-gray-400 bg-gray-100"
            onClick={handleObjectSave}
          >
            Добавить объект
          </button>
        </div>

        {objects.length > 0 &&
          <Tabs className="mb-5 p-3 border-2 rounded border-gray-400">
            <TabList>
              {objects.map((obj, index) => (
                <Tab
                  key={index}
                  onClick={(e) => handleTabClick(e)}
                >
                  {obj}
                </Tab>
              ))}
            </TabList>
            {objects.map((obj, index) => (
              <TabPanel key={index}>
                {data.some(el => el.name === currentObject) &&
                  <div className="mb-3 p-2 border-2 rounded border-gray-300">
                    <table className="w-full">
                      <thead className="border rounded border-gray-300">
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
                        {data.map((item, index) => item.name === obj ?
                          <tr key={index}>
                            <td>{item.date}</td>
                            <td>{item.el}</td>
                            <td>{item.water}</td>
                            <td>{item.water}</td>
                            <td>{item.diffEl}</td>
                            <td>{item.diffWater}</td>
                            <td>{item.diffWater*50 + item.diffEl*6}</td>
                          </tr>
                          : null)}
                      </tbody>
                    </table>
                  </div>
                }
                <div className="">
                  <input
                    className="h-10 p-1 mr-2 border-2 rounded border-gray-300 w-32"
                    type="date"
                    value={date}
                    placeholder='Дата'
                    onChange={(e) => handleDateChange(e)}
                  />
                  <input
                    className="h-10 p-1 mr-2 border-2 rounded border-gray-300"
                    type="number"
                    value={el}
                    placeholder="Эл-во"
                    onChange={(e) => handleElChange(e)}
                  />
                  <input
                    className="h-10 p-1 mr-2 border-2 rounded border-gray-300"
                    type="number"
                    value={water}
                    placeholder="Вода"
                    onChange={(e) => handleWaterChange(e)}
                  />
                  <button
                    className="h-10 p-1 border-2 rounded border-gray-300 bg-gray-100"
                    onClick={handleSave}
                  >
                    Добавить
                  </button>
                </div>
              </TabPanel>
            ))}
          </Tabs>
        }

        {data.length !== 0 &&
          <div className="p-3 border-2 rounded border-gray-300">
            <table className="w-full">
              <thead className="border rounded border-gray-300">
                <tr>
                  <th>Объект</th>
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
                {data.map((item, index) => (
                  <tr key={index}>
                    <td>{item.name}</td>
                    <td>{item.date}</td>
                    <td>{item.el}</td>
                    <td>{item.water}</td>
                    <td>{item.water}</td>
                    <td>{item.diffEl}</td>
                    <td>{item.diffWater}</td>
                    <td>{item.diffWater*50 + item.diffEl*6}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        }
      </div>
    </>
  )
}

export default App
