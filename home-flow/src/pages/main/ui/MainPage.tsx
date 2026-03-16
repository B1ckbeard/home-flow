import styles from "./styles.module.css";
import { useState, useEffect, type ChangeEvent } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import { AreaListItem } from "@/components/area";
import { IndicationsList } from "@/components/indication";
import { getUser } from "@/shared/hooks/useAuth";
import type { User, Object } from "@/shared/interfaces/types";

const MainPage = () => {
  const [objectName, setObjectName] = useState("");
  const [objects, setObjects] = useState<Object[]>([]);
  const [currentObject, setCurrentObject] = useState<Object | null>(null);
  const [date, setDate] = useState("");
  const [el, setEl] = useState("");
  // const [prevValues, setPrevValues] = useState({});
  const [water, setWater] = useState("");
  const [objectNameError, setObjectNameError] = useState(false);
  const [curData, setCurData] = useState([]);
  const [curUser, setCurUser] = useState<User | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const userData = getUser();

    if (userData?.token) {
      setCurUser(userData);
      fetchUserObjects(userData.userId);
    } else {
      navigate("/login");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (currentObject && Object.keys(currentObject).length !== 0) {
      fetchObjIndications();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentObject]);

  /*
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
  */

  const fetchUserObjects = async (userId: string) => {
    try {
      const response = await axios.get(
        `http://localhost:3001/api/auth/objects/${userId}`,
      );
      const objects = response.data;
      console.log("objects: ", objects);
      setObjects(objects);

      if (objects.length > 0 && currentObject) {
        if (Object.keys(currentObject).length === 0) {
          setCurrentObject(objects[0]);
        } else {
          setCurrentObject(objects.at(-1));
        }
      } else {
        console.log("Массив objects пуст");
      }
    } catch (error) {
      console.error("Ошибка при получении объектов:", error);
    }
  };

  const fetchObjIndications = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3001/api/objects/indications/${currentObject?._id}`,
      );
      console.log("indications: ", response.data);
      setCurData(response.data);
    } catch (error) {
      console.error("Ошибка при получении показаний:", error);
    }
  };

  const handleObjectNameChange = (
    e: ChangeEvent<HTMLInputElement, HTMLInputElement>,
  ) => {
    setObjectName(e.target.value);
    setObjectNameError(false);
  };

  const handleDateChange = (
    e: ChangeEvent<HTMLInputElement, HTMLInputElement>,
  ) => {
    setDate(e.target.value);
  };

  const handleElChange = (
    e: ChangeEvent<HTMLInputElement, HTMLInputElement>,
  ) => {
    setEl(e.target.value);
  };

  const handleWaterChange = (
    e: ChangeEvent<HTMLInputElement, HTMLInputElement>,
  ) => {
    setWater(e.target.value);
  };

  const handleTabClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    const curObjName = target.textContent;
    const curObj = objects.find((el) => el.name === curObjName);
    if (curObj) {
      setCurrentObject(curObj);
    }
  };

  const handleObjectSave = async () => {
    if (!curUser) return;

    if (objectName) {
      const objectExists = objects.some((obj) => obj.name === objectName);
      if (objectExists) {
        setObjectNameError(true);
      } else {
        setObjectNameError(false);
        await axios.post("http://localhost:3001/api/objects/save", {
          name: objectName,
          userId: curUser.userId,
        });
        //await fetchObjects();
        //console.log(curUser)
        await fetchUserObjects(curUser.userId);
        setObjectName("");
      }
    }
  };

  const handleObjectDelete = async () => {
    if (!curUser || !currentObject) return;

    await axios.post(
      `http://localhost:3001/api/objects/delete/${currentObject._id}`,
    );
    //await fetchObjects();
    await fetchUserObjects(curUser.userId);
    if (objects.length > 0) {
      setCurrentObject(objects[0]);
    } else {
      setCurrentObject(null);
    }
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
        const objectId = currentObject._id;
        const response = await axios.post(
          "http://localhost:3001/api/indications/create",
          {
            date,
            el,
            water,
            objectId,
          },
        );
        const newIndication = response.data;

        if (!newIndication || !newIndication._id) {
          throw new Error("Не удалось создать запись или получить её ID");
        }

        setEl("");
        setWater("");
        setDate("");

        console.log("Новая запись успешно создана и добавлена:", newIndication);
        fetchObjIndications();
      } catch (error) {
        console.error("Ошибка при сохранении показания:", error);
      }
    }
  };

  const handleDeleteIndication = async (id: string) => {
    await axios.post(`http://localhost:3001/api/indications/delete/${id}`);
    console.log(id, "deleted");
    fetchObjIndications();
  };

  return (
    <div className={styles.mainPage}>
      <div className={styles.areasSidebar}>
        <div className={styles.areaCreateForm}>
          <input
            className={`${styles.areaFormInput} ${objectNameError ? styles.areaFormInputError : ""}`}
            type="text"
            value={objectName}
            placeholder="Введите название"
            onChange={(e) => handleObjectNameChange(e)}
          />
          {objectNameError && (
            <p className={styles.areaFormErrorText}>
              Объект с таким названием уже существует
            </p>
          )}
          <button className={styles.areaFormButton} onClick={handleObjectSave}>
            Добавить объект
          </button>
        </div>
        {objects.length === 0 && (
          <p className={styles.areasListEmpty}>Список пуст</p>
        )}
        <ul className={styles.areasList}>
          {objects.map((obj, index) => (
            <li key={index}>
              {AreaListItem({
                area: obj,
                curArea: currentObject,
                onClick: handleTabClick,
                onDelete: handleObjectDelete,
              })}
            </li>
          ))}
        </ul>
      </div>
      <div className={styles.indicationsContent}>
        {objects.length === 0 && (
          <p className={styles.indicationsEmpty}>Создайте объект</p>
        )}
        {objects.length > 0 && currentObject && (
          <div className={styles.indicationsWrapper}>
            <div className={styles.indicationCreateForm}>
              <input
                className={styles.indicationFormInput}
                type="date"
                value={date}
                placeholder="Дата"
                onChange={(e) => handleDateChange(e)}
              />
              <input
                className={styles.indicationFormInput}
                type="number"
                value={el}
                placeholder="Эл-во"
                onChange={(e) => handleElChange(e)}
              />
              <input
                className={styles.indicationFormInput}
                type="number"
                value={water}
                placeholder="Вода"
                onChange={(e) => handleWaterChange(e)}
              />
              <button
                className={styles.indicationFormButton}
                onClick={handleSaveIndication}
              >
                Добавить
              </button>
            </div>
            {currentObject &&
              Object.keys(currentObject).length !== 0 &&
              IndicationsList({
                data: curData,
                onDelete: handleDeleteIndication,
              })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MainPage;
