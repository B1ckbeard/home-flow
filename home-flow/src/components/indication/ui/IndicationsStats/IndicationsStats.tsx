import { useMemo } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from "recharts";
import styles from "./styles.module.css";
import type { Indication, Meter } from "@/shared/interfaces/types";

interface IndicationsStatsProps {
  indications: Indication[];
  meters: Meter[];
  onClose: () => void;
}

interface ChartData {
  month: string;
  [key: string]: string | number;
}

const IndicationsStats = ({
  indications,
  meters,
  onClose,
}: IndicationsStatsProps) => {
  const chartData = useMemo(() => {
    if (!indications.length) return [];

    const sortedIndications = [...indications].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );

    const data: ChartData[] = [];

    for (let i = 0; i < sortedIndications.length; i++) {
      const current = sortedIndications[i];
      const previous = i > 0 ? sortedIndications[i - 1] : null;

      const month = new Date(current.date).toLocaleString("ru", {
        month: "long",
        year: "numeric",
      });

      const consumption: ChartData = { month };

      meters.forEach((meter) => {
        const currentValue =
          current.values.find((v) => v.meterId === meter._id)?.value || 0;
        const previousValue = previous
          ? previous.values.find((v) => v.meterId === meter._id)?.value || 0
          : 0;
        const diff = previous ? currentValue - previousValue : 0;

        consumption[meter.name] = diff > 0 ? diff : 0;
      });

      data.push(consumption);
    }

    return data;
  }, [indications, meters]);

  const totalConsumption = useMemo(() => {
    const totals: { [key: string]: number } = {};
    meters.forEach((meter) => {
      totals[meter.name] = 0;
    });

    chartData.forEach((data) => {
      meters.forEach((meter) => {
        const value = data[meter.name] as number;
        if (value) {
          totals[meter.name] += value;
        }
      });
    });

    return totals;
  }, [chartData, meters]);

  const averageConsumption = useMemo(() => {
    const averages: { [key: string]: number } = {};
    const monthCount = chartData.length;

    meters.forEach((meter) => {
      averages[meter.name] =
        monthCount > 0 ? totalConsumption[meter.name] / monthCount : 0;
    });

    return averages;
  }, [totalConsumption, meters, chartData.length]);

  // Форматирование чисел
  const formatNumber = (value: number) => {
    return value.toFixed(2);
  };

  const formatMonth = (month: string) => {
    return month.substring(0, 3);
  };

  const colors = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

  return (
    <div className={styles.statistics}>
      <div className={styles.statisticsHeader}>
        <h2 className={styles.statisticsTitle}>Статистика потребления</h2>
        <button onClick={onClose} className={styles.closeButton}>
          ✕
        </button>
      </div>

      <div className={styles.statsCards}>
        <div className={styles.statsCard}>
          <div className={styles.statsCardTitle}>Всего месяцев</div>
          <div className={styles.statsCardValue}>{chartData.length}</div>
        </div>
        {meters.map((meter) => (
          <div key={meter._id} className={styles.statsCard}>
            <div className={styles.statsCardTitle}>Всего {meter.name}</div>
            <div className={styles.statsCardValue}>
              {formatNumber(totalConsumption[meter.name])} {meter.unit}
            </div>
            <div className={styles.statsCardSubtitle}>
              Среднее: {formatNumber(averageConsumption[meter.name])}{" "}
              {meter.unit}
            </div>
          </div>
        ))}
      </div>

      <div className={styles.chartSection}>
        <h3 className={styles.chartTitle}>Динамика потребления</h3>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" tickFormatter={formatMonth} />
            <YAxis />
            <Legend />
            {meters.map((meter, idx) => (
              <Line
                key={meter._id}
                type="monotone"
                dataKey={meter.name}
                stroke={colors[idx % colors.length]}
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className={styles.chartSection}>
        <h3 className={styles.chartTitle}>Сравнение потребления по месяцам</h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" tickFormatter={formatMonth} />
            <YAxis />
            <Legend />
            {meters.map((meter, idx) => (
              <Bar
                key={meter._id}
                dataKey={meter.name}
                fill={colors[idx % colors.length]}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className={styles.tableSection}>
        <h3 className={styles.chartTitle}>Детальные данные по месяцам</h3>
        <div className={styles.tableWrapper}>
          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th>Месяц</th>
                {meters.map((meter) => (
                  <th key={meter._id}>
                    {meter.name}, {meter.unit}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {chartData.map((data, idx) => (
                <tr key={idx}>
                  <td className={styles.tableMonth}>{data.month}</td>
                  {meters.map((meter) => (
                    <td key={meter._id}>
                      {formatNumber(data[meter.name] as number)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default IndicationsStats;
