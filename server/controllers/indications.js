import ObjectModel from "../models/Object.js";
import IndicationModel from "../models/Indication.js";

export const createIndication = async (req, res) => {
  try {
    const { date, values, objectId } = req.body;

    if (!date) {
      return res.status(400).json({ message: "Дата обязательна" });
    }

    if (!values || !Array.isArray(values) || values.length === 0) {
      return res
        .status(400)
        .json({ message: "Необходимо передать показания счетчиков" });
    }

    const object = await ObjectModel.findById(objectId);
    if (!object) {
      return res.status(404).json({ message: "Объект не найден" });
    }

    const meterIds = object.meters.map((meter) => meter._id.toString());
    const invalidMeters = values.filter((v) => !meterIds.includes(v.meterId));

    if (invalidMeters.length > 0) {
      return res.status(400).json({
        message: "Некорректные ID счетчиков",
        invalidMeters,
      });
    }

    const newIndication = new IndicationModel({
      date,
      values,
      object: objectId,
    });

    await newIndication.save();

    object.indications.push(newIndication._id);
    await object.save();

    res.status(201).json(newIndication);
  } catch (error) {
    console.error("Ошибка при создании показания:", error);
    res.status(500).json({ message: "Что-то пошло не так." });
  }
};

export const getAll = async (req, res) => {
  try {
    const indications = await IndicationModel.find().populate(
      "object",
      "name meters",
    );

    if (!indications || indications.length === 0) {
      return res.json({ indications: [], message: "Показаний нет" });
    }

    res.json({ indications });
  } catch (error) {
    console.error("Ошибка при получении показаний:", error);
    res.status(500).json({ message: "Что-то пошло не так." });
  }
};

export const getById = async (req, res) => {
  try {
    const indication = await IndicationModel.findById(req.params.id).populate(
      "object",
      "name meters",
    );

    if (!indication) {
      return res.status(404).json({ message: "Показание не найдено" });
    }

    res.json({ indication });
  } catch (error) {
    console.error("Ошибка при получении показания:", error);
    res.status(500).json({ message: "Что-то пошло не так." });
  }
};

export const deleteIndication = async (req, res) => {
  try {
    const { id } = req.params;

    console.log("Deleting indication with ID:", id);

    const indication = await IndicationModel.findByIdAndDelete(id);

    if (!indication) {
      return res.status(404).json({ message: "Показание не найдено" });
    }

    await ObjectModel.updateOne(
      { indications: id },
      { $pull: { indications: id } },
    );

    res.json({ message: "Показание удалено" });
  } catch (error) {
    console.error("Ошибка при удалении показания:", error);
    res.status(500).json({ message: "Ошибка при удалении" });
  }
};

export const deleteAllIndications = async (req, res) => {
  try {
    await IndicationModel.deleteMany({});

    await ObjectModel.updateMany({}, { $set: { indications: [] } });

    res.json({ message: "Все показания удалены" });
  } catch (error) {
    console.error("Ошибка при удалении всех показаний:", error);
    res.status(500).json({ message: "Ошибка при удалении" });
  }
};
