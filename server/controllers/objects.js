import ObjectModel from "../models/Object.js"

// Get
export const getObjects = async (req, res) => {
  try {
    const objects = await ObjectModel.find();
    res.json(objects);
  } catch (error) {
    console.log(error)
  }
};

// saveObject
export const saveObject = async (req, res) => {
  try {
    const { name } = req.body;
    const newObject = new ObjectModel({ name });
    await newObject.save();
    res.json({ newObject, message: 'Объект сохранен' });
  } catch (error) {
    res.json({ message: 'Ошибка при создании объекта' })
  }
};

// Delete
export const deleteObject = async (req, res) => {
  try {
    const { id } = req.params;
    await ObjectModel.findByIdAndDelete(id);
    res.json({ message: 'Объект удален' });
  } catch (error) {
    res.json({ message: 'Ошибка при удалении объекта' })
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
