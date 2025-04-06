import { Router } from "express";
import { saveObject, getObjects, deleteObject, deleteAllObjects, getObjIndications } from "../controllers/objects.js";

const router = new Router()

// Get
// http://localhost:3001/api/objects
router.get('/', getObjects)

// Save
// http://localhost:3001/api/objects/save
router.post('/save', saveObject)

// Delete
// http://localhost:3001/api/objects/delete/:id
// поменять на http://localhost:3001/api/objects/:id/delete
router.post('/delete/:id', deleteObject)

// Delete all
// http://localhost:3001/api/objects/delete/all
router.get('/delete/all', deleteAllObjects)

// Get By Id
// http://localhost:3002/api/objects/:id

// Get Obj Indications
// http://localhost:3001/api/objects/indications/:id
// поменять на http://localhost:3001/api/objects/:id/indications
router.get('/indications/:id', getObjIndications)

export default router
