import styles from "./styles.module.css";
import { useState, type ChangeEvent } from "react";
import { AreaListItem } from "@/components/area";
import type { Object } from "@/shared/interfaces/types";

interface AreasSidebarProps {
  objects: Object[];
  currentObject: Object | null;
  isLoading: boolean;
  onObjectSelect: (obj: Object) => void;
  onObjectSave: (name: string) => Promise<void>;
  onObjectDelete: () => Promise<void>;
  onConfigureMeters: (obj: Object) => void;
}

const AreasSidebar = ({
  objects,
  currentObject,
  isLoading,
  onObjectSelect,
  onObjectSave,
  onObjectDelete,
  onConfigureMeters,
}: AreasSidebarProps) => {
  const [objectName, setObjectName] = useState("");
  const [objectNameError, setObjectNameError] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleObjectNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setObjectName(e.target.value);
    setObjectNameError(false);
  };

  const handleObjectSave = async () => {
    if (!objectName.trim()) {
      setObjectNameError(true);
      return;
    }

    try {
      setIsSaving(true);
      await onObjectSave(objectName.trim());
      setObjectName("");
      setObjectNameError(false);
    } catch (error) {
      setObjectNameError(true);
      console.error("Ошибка при создании объекта:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleTabClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    const curObjName = target.textContent;
    const curObj = objects.find((el) => el.name === curObjName);
    if (curObj) {
      onObjectSelect(curObj);
    }
  };

  return (
    <div className={styles.areasSidebar}>
      <div className={styles.areaCreateForm}>
        <input
          className={`${styles.areaFormInput} ${objectNameError ? styles.areaFormInputError : ""}`}
          type="text"
          value={objectName}
          placeholder="Введите название объекта"
          onChange={handleObjectNameChange}
          disabled={isSaving}
        />
        {objectNameError && (
          <p className={styles.areaFormErrorText}>
            Объект с таким названием уже существует или название не может быть
            пустым
          </p>
        )}
        <button
          className={styles.areaFormButton}
          onClick={handleObjectSave}
          disabled={!objectName.trim() || isSaving}
        >
          {isSaving ? "Сохранение..." : "Добавить объект"}
        </button>
      </div>

      {isLoading ? (
        <div className={styles.loader}>Загрузка объектов...</div>
      ) : objects.length === 0 ? (
        <p className={styles.areasListEmpty}>Список пуст</p>
      ) : (
        <ul className={styles.areasList}>
          {objects.map((obj) => (
            <li key={obj._id}>
              <AreaListItem
                area={obj}
                curArea={currentObject}
                onClick={handleTabClick}
                onDelete={onObjectDelete}
                onConfigure={() => onConfigureMeters(obj)}
                showConfigureButton={true}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AreasSidebar;
