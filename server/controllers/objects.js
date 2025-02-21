import ObjectModel from "../models/Object.js"

// Get
export const getObjects = async (req, res) => {
  try {
    const objects = await ObjectModel.find();
    res.json(objects);
    console.log('get objects')
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
    console.log('Объект сохранен')

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
    console.log('Объект удален')

  } catch (error) {
    res.json({ message: 'Ошибка при удалении объекта' })
  }
}
