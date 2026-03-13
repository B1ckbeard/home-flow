import { FaDeleteLeft } from "react-icons/fa6";
import styles from "./styles.module.css";
import type { Item } from "@/shared/interfaces/types";

interface Props {
  data: Item[];
  onDelete: (id: string) => void;
}

const IndicationsList = ({ data, onDelete }: Props) => {
  const safeData = Array.isArray(data)
    ? data.filter((item) => item !== null)
    : [];
  const lastIndex = safeData.length - 1;
  return (
    <div className={styles.wrapper}>
      {safeData.length === 0 ? (
        <p className={styles.emptyListText}>Список пуст</p>
      ) : (
        <table className={styles.table}>
          <thead className={styles.tableHead}>
            <tr className={styles.tableRow}>
              <th>Дата</th>
              <th>Эл-во</th>
              <th>Вода</th>
              <th>Расход эл-ва</th>
              <th>Расход воды</th>
            </tr>
          </thead>
          <tbody className={styles.tableBody}>
            {safeData.map((item, index) => {
              return (
                <tr key={index} className={styles.tableRow}>
                  <td>{item.date}</td>
                  <td>{item.el}</td>
                  <td>{item.water}</td>
                  <td>Расход эл-ва</td>
                  <td>Расход воды</td>
                  <td className={styles.tableDeleteItem}>
                    {index === lastIndex && (
                      <button onClick={() => onDelete(item._id)}>
                        <FaDeleteLeft className={styles.deleteButton} />
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default IndicationsList;
