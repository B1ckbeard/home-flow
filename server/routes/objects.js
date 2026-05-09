import { Router } from "express";
import {
  saveObject,
  getObjects,
  deleteObject,
  deleteAllObjects,
  getObjIndications,
  getObjectById,
  updateObjectMeters,
} from "../controllers/objects.js";

const router = new Router();

// Get all objects
router.get("/", getObjects);

// Get object by id
router.get("/:id", getObjectById);

// Get object indications
router.get("/:id/indications", getObjIndications);

// Update object meters
router.put("/:id/meters", updateObjectMeters);

// Save object
router.post("/save", saveObject);

// Delete object 
router.delete("/:id", deleteObject);

// Delete all objects
router.delete("/", deleteAllObjects);

export default router;
