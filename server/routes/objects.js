import { Router } from "express";
import { saveObject, getObjects, deleteObject, getObjIndications } from "../controllers/objects.js";

const router = new Router()

// Get
// http://localhost:3001/api/objects
router.get('/', getObjects)

// Save
// http://localhost:3001/api/objects/save
router.post('/save', saveObject)

// Delete
// http://localhost:3001/api/objects/delete/:id
router.post('/delete/:id', deleteObject)

// Get Obj Indications
// http://localhost:3001/api/objects/indications/:id
router.get('/indications/:id', getObjIndications)

export default router
