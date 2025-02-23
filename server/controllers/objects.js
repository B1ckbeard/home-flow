import ObjectModel from "../models/Object.js"
import IndicationModel from "../models/Indication.js"

// Get
export const getObjects = async (req, res) => {
  try {
    const objects = await ObjectModel.find();
    res.json(objects);
  } catch (error) {
    console.log(error)
  }
}

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
}

// Delete
export const deleteObject = async (req, res) => {
  try {
    const { id } = req.params;
    await ObjectModel.findByIdAndDelete(id);
    res.json({ message: 'Объект удален' });
  } catch (error) {
    res.json({ message: 'Ошибка при удалении объекта' })
  }
}

// Get Obj Indications by objId
export const getObjIndications = async (req, res) => {
  try {
    const object = await ObjectModel.findById(req.params.id)
    const list = await Promise.all(
      object.indications.map((ind) => {
          return IndicationModel.findById(ind)
      }),
    )
    res.json(list)
  } catch (error) {
    res.json({ message: 'Что-то пошло не так' })
  }
}

// Add Indication to obj
export const addIndication = async (req, res) => {
  const { id } = req.params;
  const { indicationId } = req.body;
  try {
    const object = await ObjectModel.findById(id);
    if (!object) {
      return res.status(404).json({ message: 'Object not found' });
    }
    object.indications.push(indicationId);
    await object.save();
    res.json(object);
  } catch (error) {
    console.error('Error adding indication:', error);
    res.status(500).json({ message: 'Server error' });
  }
}
