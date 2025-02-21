import { Router } from "express";
import { saveObject, getObjects, deleteObject } from "../controllers/objects.js";

const router = new Router()

// Get
router.get('/get', getObjects)

// Save
router.post('/save', saveObject)

// Delete
router.post('/delete/:id', deleteObject)

export default router
