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
  return (
    <div
      onClick={(e) => onClick(e)}
      className={`${styles.item}${area.name === curArea?.name ? styles.active : ""}`}
    >
      {area.name}
      {area.name === curArea?.name && (
        <button onClick={onDelete}>
          <MdDeleteForever className={styles.deleteButton} />
        </button>
      )}
    </div>
  );
};

export default AreaListItem;
