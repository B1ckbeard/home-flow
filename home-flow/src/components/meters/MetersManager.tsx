import { useState, useEffect } from "react";
import styles from "./styles.module.css";
import { FaPlus, FaTrash, FaSave, FaTimes } from "react-icons/fa";
import type { Meter } from "@/shared/interfaces/types";

interface Props {
  meters: Meter[];
  objectName?: string;
  onMetersChange: (meters: Meter[]) => void;
  onClose?: () => void;
}

const MetersManager = ({
  meters,
  objectName,
  onMetersChange,
  onClose,
}: Props) => {
  const [localMeters, setLocalMeters] = useState<Meter[]>([]);
  const [newMeterName, setNewMeterName] = useState("");
  const [newMeterUnit, setNewMeterUnit] = useState("");
  const [newMeterType, setNewMeterType] = useState<Meter["type"]>("other");
  const [newMeterRate, setNewMeterRate] = useState("");
  const [newMeterHasSewage, setNewMeterHasSewage] = useState(false);
  const [newMeterSewageRate, setNewMeterSewageRate] = useState("");
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    setLocalMeters(JSON.parse(JSON.stringify(meters)));
  }, [meters]);

  useEffect(() => {
    const hasUnsavedChanges =
      JSON.stringify(localMeters) !== JSON.stringify(meters);
    setHasChanges(hasUnsavedChanges);
  }, [localMeters, meters]);

  const addMeter = () => {
    if (newMeterName && newMeterUnit && newMeterRate) {
      const newMeter: Meter = {
        name: newMeterName,
        unit: newMeterUnit,
        type: newMeterType,
        rate: Number(newMeterRate),
      };

      if (newMeterType === "water" && newMeterHasSewage && newMeterSewageRate) {
        newMeter.hasSewage = true;
        newMeter.sewageRate = Number(newMeterSewageRate);
      }

      setLocalMeters([...localMeters, newMeter]);

      // Очищаем форму
      setNewMeterName("");
      setNewMeterUnit("");
      setNewMeterType("other");
      setNewMeterRate("");
      setNewMeterHasSewage(false);
      setNewMeterSewageRate("");
    }
  };

  const removeMeter = (index: number) => {
    const updatedMeters = localMeters.filter((_, i) => i !== index);
    setLocalMeters(updatedMeters);
  };

  const updateMeterRate = (index: number, rate: number) => {
    const updatedMeters = [...localMeters];
    updatedMeters[index].rate = rate;
    setLocalMeters(updatedMeters);
  };

  const updateMeterSewage = (
    index: number,
    hasSewage: boolean,
    sewageRate?: number,
  ) => {
    const updatedMeters = [...localMeters];
    updatedMeters[index].hasSewage = hasSewage;
    if (sewageRate !== undefined) {
      updatedMeters[index].sewageRate = sewageRate;
    }
    setLocalMeters(updatedMeters);
  };

  const updateMeterName = (index: number, name: string) => {
    const updatedMeters = [...localMeters];
    updatedMeters[index].name = name;
    setLocalMeters(updatedMeters);
  };

  const updateMeterUnit = (index: number, unit: string) => {
    const updatedMeters = [...localMeters];
    updatedMeters[index].unit = unit;
    setLocalMeters(updatedMeters);
  };

  const handleSave = () => {
    onMetersChange(localMeters);
  };

  const handleCancel = () => {
    setLocalMeters(JSON.parse(JSON.stringify(meters)));
    if (onClose) onClose();
  };

  return (
    <div className={styles.metersManager}>
      <div className={styles.metersManagerHeader}>
        <h3 className={styles.metersManagerTitle}>
          Настройка счетчиков для: {objectName || "объекта"}
        </h3>
        {onClose && (
          <button
            className={styles.closeMetersManager}
            onClick={onClose}
            title="Закрыть"
          >
            ✕
          </button>
        )}
      </div>

      {hasChanges && (
        <div className={styles.unsavedIndicator}>
          Есть несохраненные изменения
        </div>
      )}

      <div className={styles.metersList}>
        {localMeters.length === 0 ? (
          <div className={styles.emptyMeters}>
            Нет добавленных счетчиков. Добавьте первый счетчик.
          </div>
        ) : (
          localMeters.map((meter, index) => (
            <div key={index} className={styles.meterItem}>
              <div className={styles.meterBasicInfo}>
                <input
                  type="text"
                  value={meter.name}
                  onChange={(e) => updateMeterName(index, e.target.value)}
                  className={styles.meterNameInput}
                  placeholder="Название"
                />
                <input
                  type="text"
                  value={meter.unit}
                  onChange={(e) => updateMeterUnit(index, e.target.value)}
                  className={styles.meterUnitInput}
                  placeholder="Ед. изм."
                />
                <select
                  value={meter.type}
                  onChange={(e) => {
                    const updatedMeters = [...localMeters];
                    updatedMeters[index].type = e.target.value as Meter["type"];
                    setLocalMeters(updatedMeters);
                  }}
                  className={styles.meterTypeSelect}
                >
                  <option value="electricity">Электричество</option>
                  <option value="water">Вода</option>
                  <option value="gas">Газ</option>
                  <option value="other">Другое</option>
                </select>
              </div>

              <div className={styles.meterRateInfo}>
                <div className={styles.rateField}>
                  <label>Тариф (₽):</label>
                  <input
                    type="number"
                    value={meter.rate || ""}
                    onChange={(e) =>
                      updateMeterRate(index, Number(e.target.value))
                    }
                    className={styles.rateInput}
                    step="0.01"
                    placeholder="0.00"
                  />
                </div>

                {meter.type === "water" && (
                  <div className={styles.sewageField}>
                    <label className={styles.checkboxLabel}>
                      <input
                        type="checkbox"
                        checked={meter.hasSewage || false}
                        onChange={(e) =>
                          updateMeterSewage(index, e.target.checked)
                        }
                      />
                      Водоотведение
                    </label>
                    {meter.hasSewage && (
                      <div className={styles.sewageRateField}>
                        <label>Тариф водоотведения (₽):</label>
                        <input
                          type="number"
                          value={meter.sewageRate || ""}
                          onChange={(e) =>
                            updateMeterSewage(
                              index,
                              true,
                              Number(e.target.value),
                            )
                          }
                          className={styles.rateInput}
                          step="0.01"
                          placeholder="0.00"
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>

              <button
                onClick={() => removeMeter(index)}
                className={styles.removeMeterButton}
                title="Удалить счетчик"
              >
                <FaTrash />
              </button>
            </div>
          ))
        )}
      </div>

      <div className={styles.addMeterSection}>
        <h5 className={styles.addMeterTitle}>Добавить новый счетчик</h5>
        <div className={styles.addMeterForm}>
          <input
            type="text"
            value={newMeterName}
            onChange={(e) => setNewMeterName(e.target.value)}
            placeholder="Название счетчика*"
            className={styles.meterInput}
          />
          <input
            type="text"
            value={newMeterUnit}
            onChange={(e) => setNewMeterUnit(e.target.value)}
            placeholder="Ед. измерения*"
            className={styles.meterInput}
          />
          <select
            value={newMeterType}
            onChange={(e) => setNewMeterType(e.target.value as Meter["type"])}
            className={styles.meterSelect}
          >
            <option value="electricity">Электричество</option>
            <option value="water">Вода</option>
            <option value="gas">Газ</option>
            <option value="other">Другое</option>
          </select>
          <input
            type="number"
            value={newMeterRate}
            onChange={(e) => setNewMeterRate(e.target.value)}
            placeholder="Тариф*"
            className={styles.meterInput}
            step="0.01"
          />

          {newMeterType === "water" && (
            <>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={newMeterHasSewage}
                  onChange={(e) => setNewMeterHasSewage(e.target.checked)}
                />
                Водоотведение
              </label>
              {newMeterHasSewage && (
                <input
                  type="number"
                  value={newMeterSewageRate}
                  onChange={(e) => setNewMeterSewageRate(e.target.value)}
                  placeholder="Тариф водоотведения"
                  className={styles.meterInput}
                  step="0.01"
                />
              )}
            </>
          )}

          <button
            onClick={addMeter}
            className={styles.addMeterButton}
            disabled={!newMeterName || !newMeterUnit || !newMeterRate}
          >
            <FaPlus /> Добавить
          </button>
        </div>
      </div>

      <div className={styles.metersManagerActions}>
        <button onClick={handleCancel} className={styles.cancelButton}>
          <FaTimes /> Отмена
        </button>
        <button
          onClick={handleSave}
          className={styles.saveButton}
          disabled={!hasChanges}
        >
          <FaSave /> Сохранить изменения
        </button>
      </div>
    </div>
  );
};

export default MetersManager;
