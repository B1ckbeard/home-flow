import ObjectModel from "../models/Object.js"
import IndicationModel from "../models/Indication.js"

// create Indication
export const createIndication = async (req, res) => {
  try {
    const { date, el, water, objectId } = req.body;

    const newIndication = new IndicationModel({
      date,
      el,
      water,
      object: objectId,
    });
    await newIndication.save();

    const object = await ObjectModel.findById(objectId);
    if (!object) {
      return res.status(404).json({ message: 'Объект не найден' });
    }

    object.indications.push(newIndication._id);
    await object.save();

    res.json(newIndication);
  } catch (error) {
    console.error('Ошибка при создании показания:', error);
    res.status(500).json({ message: 'Что-то пошло не так.' });
  }
};

// Get All indications
export const getAll = async (req, res) => {
  try {
      const indications = await IndicationModel.find()
      if (!indications) {
          return res.json({ message: 'Показаний нет' })
      }
      res.json({ indications })
  } catch (error) {
      res.json({ message: 'Что-то пошло не так.' })
  }
}

// get indication by id
export const getById = async (req, res) => {
  try {
      const indication = await IndicationModel.findById(req.params.id);
      res.json({ indication })
  } catch (error) {
      res.json({ message: 'Что-то пошло не так.' })
  }
}

// delete indication
export const deleteIndication = async (req, res) => {
  try {
    const { id } = req.params;

    await IndicationModel.findByIdAndDelete(id);

    await ObjectModel.updateMany(
      { indications: id },
      { $pull: { indications: id } }
    );

    res.json({ message: 'показание удалено' });
  } catch (error) {
    res.json({ message: 'Ошибка при удалении' })
  }
}
