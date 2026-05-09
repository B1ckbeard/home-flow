import ObjectModel from "../models/Object.js";
import IndicationModel from "../models/Indication.js";
import UserModel from "../models/User.js";

export const getObjects = async (req, res) => {
  try {
    const objects = await ObjectModel.find().populate("user", "email");
    res.json(objects);
  } catch (error) {
    console.error("Ошибка при получении объектов:", error);
    res.status(500).json({ message: "Ошибка при получении объектов" });
  }
};

export const getObjectById = async (req, res) => {
  try {
    const object = await ObjectModel.findById(req.params.id);

    if (!object) {
      return res.status(404).json({ message: "Объект не найден" });
    }

    res.json(object);
  } catch (error) {
    console.error("Ошибка при получении объекта:", error);
    res.status(500).json({ message: "Что-то пошло не так" });
  }
};

export const getObjIndications = async (req, res) => {
  try {
    const { id } = req.params;

    console.log("Fetching indications for object ID:", id);

    const object = await ObjectModel.findById(id).populate({
      path: "indications",
      options: { sort: { date: -1 } },
    });

    if (!object) {
      return res.status(404).json({ message: "Объект не найден" });
    }

    res.status(200).json(object.indications || []);
  } catch (error) {
    console.error("Ошибка при получении показаний:", error);
    res.status(500).json({
      message: "Ошибка при получении показаний",
      error: error.message,
    });
  }
};

export const updateObjectMeters = async (req, res) => {
  try {
    const { id } = req.params;
    const { meters } = req.body;

    if (!meters || !Array.isArray(meters)) {
      return res.status(400).json({ message: "Некорректный формат счетчиков" });
    }

    const object = await ObjectModel.findById(id);

    if (!object) {
      return res.status(404).json({ message: "Объект не найден" });
    }

    object.meters = meters.map((meter) => ({
      ...meter,
      name: meter.name,
      unit: meter.unit,
      type: meter.type,
      rate: meter.rate,
      hasSewage: meter.hasSewage,
      sewageRate: meter.sewageRate,
    }));

    await object.save();

    res.json({
      object,
      message: "Счетчики обновлены",
    });
  } catch (error) {
    console.error("Ошибка при обновлении счетчиков:", error);
    res.status(500).json({ message: "Ошибка при обновлении счетчиков" });
  }
};

export const saveObject = async (req, res) => {
  try {
    const { name, userId, meters } = req.body;

    if (!name || !userId) {
      return res
        .status(400)
        .json({ message: "Имя объекта и ID пользователя обязательны" });
    }

    const newObject = new ObjectModel({
      name,
      user: userId,
      meters: meters || [],
    });

    await newObject.save();

    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Пользователь не найден" });
    }

    user.objects.push(newObject._id);
    await user.save();

    res.status(201).json({
      newObject,
      message: "Объект сохранен",
    });
  } catch (error) {
    console.error("Ошибка при создании объекта:", error);
    res.status(500).json({ message: "Ошибка при создании объекта" });
  }
};

export const deleteObject = async (req, res) => {
  try {
    const { id } = req.params;

    console.log("Deleting object with ID:", id);

    const object = await ObjectModel.findByIdAndDelete(id);

    if (!object) {
      return res.status(404).json({ message: "Объект не найден" });
    }

    await IndicationModel.deleteMany({ object: id });

    await UserModel.updateOne({ objects: id }, { $pull: { objects: id } });

    res.json({ message: "Объект удален" });
  } catch (error) {
    console.error("Ошибка при удалении объекта:", error);
    res.status(500).json({ message: "Ошибка при удалении объекта" });
  }
};

export const deleteAllObjects = async (req, res) => {
  try {
    await ObjectModel.deleteMany({});
    await IndicationModel.deleteMany({});
    await UserModel.updateMany({}, { $set: { objects: [] } });
    res.json({ message: "Все объекты удалены" });
  } catch (error) {
    console.error("Ошибка при удалении всех объектов:", error);
    res.status(500).json({ message: "Ошибка при удалении" });
  }
};
