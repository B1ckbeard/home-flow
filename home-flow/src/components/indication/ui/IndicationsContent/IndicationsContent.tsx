import { useState } from "react";
import styles from "./styles.module.css";
import {
  IndicationForm,
  IndicationsList,
  IndicationsStats,
} from "@/components/indication";
import MetersManager from "@/components/meters/MetersManager";
import type { Object, Meter, Indication } from "@/shared/interfaces/types";

interface IndicationsContentProps {
  objects: Object[];
  currentObject: Object | null;
  objectMeters: Meter[];
  indications: Indication[];
  showMetersManager: boolean;
  selectedObjectForConfig: Object | null;
  isIndicationsLoading: boolean;
  onSaveIndication: (
    values: { meterId: string; value: number }[],
    date: string,
  ) => Promise<void>;
  onDeleteIndication: (id: string) => Promise<void>;
  onMetersChange: (meters: Meter[]) => Promise<void>;
  onCloseMetersManager: () => void;
}

const IndicationsContent = ({
  objects,
  currentObject,
  objectMeters,
  indications,
  showMetersManager,
  selectedObjectForConfig,
  isIndicationsLoading,
  onSaveIndication,
  onDeleteIndication,
  onMetersChange,
  onCloseMetersManager,
}: IndicationsContentProps) => {
  const [showStatistics, setShowStatistics] = useState(false);

  const handleViewStatistics = () => {
    setShowStatistics(true);
  };

  const handleCloseStatistics = () => {
    setShowStatistics(false);
  };

  if (objects.length === 0) {
    return (
      <div className={styles.indicationsContent}>
        <p className={styles.indicationsEmpty}>Создайте объект</p>
      </div>
    );
  }

  if (!currentObject) {
    return (
      <div className={styles.indicationsContent}>
        <p className={styles.indicationsEmpty}>Выберите объект</p>
      </div>
    );
  }

  return (
    <div className={styles.indicationsContent}>
      <div className={styles.indicationsWrapper}>
        {showStatistics ? (
          <IndicationsStats
            indications={indications}
            meters={objectMeters}
            onClose={handleCloseStatistics}
          />
        ) : showMetersManager && selectedObjectForConfig ? (
          <MetersManager
            meters={objectMeters}
            objectName={selectedObjectForConfig.name}
            onMetersChange={onMetersChange}
            onClose={onCloseMetersManager}
          />
        ) : (
          <>
            {isIndicationsLoading ? (
              <div className={styles.loader}>Загрузка показаний...</div>
            ) : (
              <>
                <IndicationForm
                  key={objectMeters.map((m) => m._id).join(",")}
                  meters={objectMeters}
                  onSave={onSaveIndication}
                />

                <IndicationsList
                  data={indications}
                  meters={objectMeters}
                  onDelete={onDeleteIndication}
                  onViewStatistics={handleViewStatistics}
                />
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default IndicationsContent;
