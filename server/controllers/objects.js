import ObjectModel from "../models/Object.js"
import IndicationModel from "../models/Indication.js"
import UserModel from "../models/User.js";

// Get all objects
export const getObjects = async (req, res) => {
  try {
    const objects = await ObjectModel.find();
    res.json(objects);
  } catch (error) {
    console.log(error)
  }
};

// Get Obj Indications by objId
export const getObjIndications = async (req, res) => {
  try {
    const object = await ObjectModel.findById(req.params.id).populate('indications');

    if (!object) {
      return res.status(404).json({ message: 'Объект не найден' });
    }

    res.json(object.indications);
  } catch (error) {
    console.error('Ошибка при получении показаний:', error);
    res.status(500).json({ message: 'Что-то пошло не так' });
  }
};

// save object by user
export const saveObject = async (req, res) => {
  try {
    const { name, userId } = req.body;
    const newObject = new ObjectModel({ name, user: userId });
    await newObject.save();

    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Объект не найден' });
    }
    user.objects.push(newObject._id);
    await user.save();

    res.json({ newObject, message: 'Объект сохранен' });
  } catch (error) {
    res.json({ message: 'Ошибка при создании объекта' })
  }
};

// Delete object by id
export const deleteObject = async (req, res) => {
  try {
    const { id } = req.params;
    await ObjectModel.findByIdAndDelete(id);
    await IndicationModel.deleteMany({ object: id });
    await UserModel.updateMany(
      { objects: id },
      { $pull: { objects: id } }
    );
    res.json({ message: 'Объект удален' });
  } catch (error) {
    res.json({ message: 'Ошибка при удалении объекта' })
  }
};

// Delete all objects
export const deleteAllObjects = async (req, res) => {
  try {
    await ObjectModel.collection.drop();
    res.json({ message: 'Объекты удалены' });
  } catch (error) {
    res.json({ message: 'Ошибка при удалении' })
  }
}
