import { useMemo } from "react";
import styles from "./styles.module.css";
import { FaChartLine, FaDeleteLeft } from "react-icons/fa6";
import type { Indication, Meter, Consumption } from "@/shared/interfaces/types";

interface Props {
  data: Indication[];
  meters: Meter[];
  onDelete: (id: string) => void;
  onViewStatistics?: () => void;
}

const IndicationsList = ({
  data,
  meters,
  onDelete,
  onViewStatistics,
}: Props) => {
  const safeData = Array.isArray(data)
    ? data.filter((item) => item !== null)
    : [];

  const sortedData = [...safeData].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );

  const lastIndex = sortedData.length - 1;

  const getMeterValue = (indication: Indication, meterId: string): number => {
    const value = indication.values.find((v) => v.meterId === meterId);
    return value ? value.value : 0;
  };

  const calculateDifference = (
    current: number,
    previous: number | undefined,
  ): number | string => {
    if (previous === undefined) return "-";
    const diff = current - previous;
    return diff >= 0 ? diff : 0;
  };

  const calculateConsumption = useMemo(() => {
    if (sortedData.length === 0) return null;

    const lastIndication = sortedData[sortedData.length - 1];
    const prevIndication =
      sortedData.length > 1 ? sortedData[sortedData.length - 2] : null;

    const consumptions: Consumption[] = [];
    let total = 0;

    meters.forEach((meter) => {
      const currentValue = getMeterValue(lastIndication, meter._id!);
      const prevValue = prevIndication
        ? getMeterValue(prevIndication, meter._id!)
        : undefined;
      const consumption =
        typeof calculateDifference(currentValue, prevValue) === "number"
          ? (calculateDifference(currentValue, prevValue) as number)
          : 0;

      const rate = meter.rate || 0;
      const cost = consumption * rate;
      total += cost;

      const consumptionData: Consumption = {
        meterId: meter._id!,
        meterName: meter.name,
        consumption,
        rate,
        cost,
      };

      if (meter.type === "water" && meter.hasSewage && meter.sewageRate) {
        const sewageCost = consumption * meter.sewageRate;
        total += sewageCost;
        consumptionData.sewage = {
          consumption,
          rate: meter.sewageRate,
          cost: sewageCost,
        };
      }

      consumptions.push(consumptionData);
    });

    return {
      total,
      details: consumptions,
    };
  }, [sortedData, meters]);

  return (
    <div className={styles.indicationsList}>
      {sortedData.length === 0 ? (
        <p className={styles.emptyListText}>Список пуст</p>
      ) : (
        <>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead className={styles.tableHead}>
                <tr className={styles.tableHeadRow}>
                  <th>Дата</th>
                  {meters.map((meter) => (
                    <th key={meter._id} title={`${meter.name} (${meter.unit})`}>
                      {meter.name}
                    </th>
                  ))}
                  {meters.map((meter) => (
                    <th
                      key={`diff-${meter._id}`}
                      title={`Расход ${meter.name}`}
                    >
                      Расход {meter.name}
                    </th>
                  ))}
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody className={styles.tableBody}>
                {sortedData.map((item, index) => {
                  const prevItem =
                    index > 0 ? sortedData[index - 1] : undefined;

                  return (
                    <tr key={item._id} className={styles.tableRow}>
                      <td>{item.date}</td>

                      {meters.map((meter) => (
                        <td key={`val-${item._id}-${meter._id}`}>
                          {getMeterValue(item, meter._id!)}
                        </td>
                      ))}

                      {meters.map((meter) => {
                        const currentValue = getMeterValue(item, meter._id!);
                        const prevValue = prevItem
                          ? getMeterValue(prevItem, meter._id!)
                          : undefined;
                        const diff = calculateDifference(
                          currentValue,
                          prevValue,
                        );

                        return (
                          <td
                            key={`diff-${item._id}-${meter._id}`}
                            className={
                              diff === "-" ? styles.first : styles.diff
                            }
                          >
                            {diff}
                          </td>
                        );
                      })}

                      <td className={styles.tableDeleteItem}>
                        {index === lastIndex && (
                          <button
                            onClick={() => onDelete(item._id)}
                            className={styles.deleteButton}
                            title="Удалить последнюю запись"
                          >
                            <FaDeleteLeft className={styles.deleteIcon} />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {onViewStatistics && (
            <div className={styles.statisticsButtonWrapper}>
              <button
                onClick={onViewStatistics}
                className={styles.statisticsButton}
              >
                <FaChartLine className={styles.statisticsIcon} />
                Статистика потребления
              </button>
            </div>
          )}

          {calculateConsumption && (
            <div className={styles.paymentBlock}>
              <h3 className={styles.paymentTitle}>Расчет к оплате</h3>
              <div className={styles.paymentDetails}>
                {calculateConsumption.details.map((detail) => (
                  <div key={detail.meterId} className={styles.paymentItem}>
                    <div className={styles.paymentItemHeader}>
                      <span className={styles.paymentItemName}>
                        {detail.meterName}
                      </span>
                      <span className={styles.paymentItemCost}>
                        {detail.cost.toFixed(2)} ₽
                      </span>
                    </div>
                    <div className={styles.paymentItemDetails}>
                      <span>Расход: {detail.consumption.toFixed(2)}</span>
                      <span>Тариф: {detail.rate.toFixed(2)} ₽</span>
                    </div>
                    {detail.sewage && (
                      <div className={styles.paymentItemSewage}>
                        <div className={styles.paymentItemHeader}>
                          <span className={styles.paymentItemName}>
                            Водоотведение
                          </span>
                          <span className={styles.paymentItemCost}>
                            {detail.sewage.cost.toFixed(2)} ₽
                          </span>
                        </div>
                        <div className={styles.paymentItemDetails}>
                          <span>
                            Расход: {detail.sewage.consumption.toFixed(2)} м³
                          </span>
                          <span>Тариф: {detail.sewage.rate.toFixed(2)} ₽</span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div className={styles.paymentTotal}>
                <span className={styles.totalLabel}>Итого к оплате:</span>
                <span className={styles.totalAmount}>
                  {calculateConsumption.total.toFixed(2)} ₽
                </span>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default IndicationsList;
