import { MdDeleteForever } from "react-icons/md";
import styles from "./styles.module.css";

interface Area {
  name: string;
}

interface Props {
  area: Area;
  curArea: Area | null;
  onClick: (e: React.MouseEvent<HTMLDivElement>) => void;
  onDelete: () => void;
}

const AreaListItem = ({ area, curArea, onClick, onDelete }: Props) => {
  const handleDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onDelete();
  };

  return (
    <div
      onClick={onClick}
      className={`${styles.item} ${area.name === curArea?.name ? styles.active : ""}`}
    >
      <span className={styles.itemText}>{area.name}</span>
      {area.name === curArea?.name && (
        <button onClick={handleDelete} className={styles.deleteButton}>
          <MdDeleteForever className={styles.deleteIcon} />
        </button>
      )}
    </div>
  );
};

export default AreaListItem;
