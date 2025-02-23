import ObjectModel from "../models/Object.js"
import IndicationModel from "../models/Indication.js"

// create Indication
export const createIndication = async (req, res) => {
  try {
    const { date, el, water } = req.body
    const newIndication = new IndicationModel({
      date,
      el,
      water
    })
    await newIndication.save()
    await ObjectModel.findByIdAndUpdate(req.objectId, {
      $push: { indications: newIndication },
    })
    res.json(newIndication)
  } catch (error) {
    res.json({ message: 'Что-то пошло не так.' })
  }
}

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
    res.json({ message: 'показание удалено' });
  } catch (error) {
    res.json({ message: 'Ошибка при удалении' })
  }
}
