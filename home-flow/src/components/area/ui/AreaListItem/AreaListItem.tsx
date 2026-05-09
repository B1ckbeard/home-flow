import { MdDeleteForever, MdSettings } from "react-icons/md";
import styles from "./styles.module.css";

interface Area {
  name: string;
  _id?: string;
}

interface Props {
  area: Area;
  curArea: Area | null;
  onClick: (e: React.MouseEvent<HTMLDivElement>) => void;
  onDelete: () => void;
  onConfigure?: () => void; // Добавляем callback для настройки
  showConfigureButton?: boolean; // Флаг для показа кнопки настройки
}

const AreaListItem = ({
  area,
  curArea,
  onClick,
  onDelete,
  onConfigure,
  showConfigureButton = false,
}: Props) => {
  const handleDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onDelete();
  };

  const handleConfigure = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onConfigure?.();
  };

  const isActive = area.name === curArea?.name;

  return (
    <div
      onClick={onClick}
      className={`${styles.item} ${isActive ? styles.active : ""}`}
    >
      <span className={styles.itemText}>{area.name}</span>
      <div className={styles.itemActions}>
        {showConfigureButton && isActive && (
          <button
            onClick={handleConfigure}
            className={styles.configureButton}
            title="Настроить счетчики"
          >
            <MdSettings className={styles.configureIcon} />
          </button>
        )}
        {isActive && (
          <button
            onClick={handleDelete}
            className={styles.deleteButton}
            title="Удалить объект"
          >
            <MdDeleteForever className={styles.deleteIcon} />
          </button>
        )}
      </div>
    </div>
  );
};

export default AreaListItem;
