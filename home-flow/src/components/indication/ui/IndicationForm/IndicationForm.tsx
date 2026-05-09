import { useState, useCallback } from "react";
import styles from "./styles.module.css";
import type { Meter } from "@/shared/interfaces/types";

interface Props {
  meters: Meter[];
  onSave: (values: { meterId: string; value: number }[], date: string) => void;
}

const IndicationForm = ({ meters, onSave }: Props) => {
  const [date, setDate] = useState(
    () => new Date().toISOString().split("T")[0],
  );
  const [values, setValues] = useState<{ [key: string]: string }>(() => {
    const initialValues: { [key: string]: string } = {};
    meters.forEach((meter) => {
      if (meter._id) {
        initialValues[meter._id] = "";
      }
    });
    return initialValues;
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleValueChange = useCallback(
    (meterId: string, value: string) => {
      setValues((prev) => ({
        ...prev,
        [meterId]: value,
      }));
      if (errorMessage) setErrorMessage("");
    },
    [errorMessage],
  );

  const handleSubmit = useCallback(async () => {
    const allFieldsFilled = meters.every(
      (meter) => meter._id && values[meter._id] && values[meter._id] !== "",
    );

    if (!date) {
      setErrorMessage("Пожалуйста, выберите дату");
      return;
    }

    if (!allFieldsFilled) {
      setErrorMessage("Пожалуйста, заполните все показания");
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage("");

      const indicationValues = meters.map((meter) => ({
        meterId: meter._id!,
        value: Number(values[meter._id!]),
      }));

      await onSave(indicationValues, date);

      setDate("");
      const resetValues: { [key: string]: string } = {};
      meters.forEach((meter) => {
        if (meter._id) {
          resetValues[meter._id] = "";
        }
      });
      setValues(resetValues);

      setSuccessMessage("Показания успешно добавлены");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      setErrorMessage("Ошибка при сохранении показаний");
      console.error("Ошибка при сохранении:", error);
    } finally {
      setIsSubmitting(false);
    }
  }, [date, meters, values, onSave]);

  const isFormValid = date && meters.every((meter) => values[meter._id!]);

  return (
    <div className={styles.indicationCreateForm}>
      {successMessage && (
        <div className={styles.successMessage}>{successMessage}</div>
      )}
      {errorMessage && (
        <div className={styles.errorMessage}>{errorMessage}</div>
      )}

      <div className={styles.formGroup}>
        <input
          className={`${styles.indicationFormInput} ${!date && errorMessage ? styles.indicationFormInputError : ""}`}
          type="date"
          value={date}
          onChange={(e) => {
            setDate(e.target.value);
            if (errorMessage) setErrorMessage("");
          }}
          placeholder="Дата"
        />
        {!date && errorMessage && (
          <div className={styles.inputHint}>Выберите дату показаний</div>
        )}
      </div>

      {meters.map((meter) => (
        <div key={meter._id} className={styles.meterInputWrapper}>
          <label className={styles.meterLabel}>
            {meter.name} ({meter.unit})
          </label>
          <input
            className={`${styles.indicationFormInput} ${!values[meter._id!] && errorMessage ? styles.indicationFormInputError : ""}`}
            type="number"
            value={values[meter._id!] || ""}
            onChange={(e) => handleValueChange(meter._id!, e.target.value)}
            placeholder={`Введите ${meter.name.toLowerCase()}`}
            step="0.01"
            disabled={isSubmitting}
          />
          {!values[meter._id!] && errorMessage && (
            <div className={styles.inputHint}>
              Введите показание для {meter.name}
            </div>
          )}
        </div>
      ))}

      <button
        className={styles.indicationFormButton}
        onClick={handleSubmit}
        disabled={!isFormValid || isSubmitting}
      >
        {isSubmitting ? (
          <>
            <span className={styles.loadingIndicator}></span>
            Сохранение...
          </>
        ) : (
          "Добавить показания"
        )}
      </button>
    </div>
  );
};

export default IndicationForm;
