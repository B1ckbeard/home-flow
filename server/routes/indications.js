import { Router } from "express";
import {
  getAll,
  createIndication,
  deleteIndication,
  deleteAllIndications,
  getById,
} from "../controllers/indications.js";

const router = new Router();

// Get all indications
router.get("/", getAll);

// Get indication by id
router.get("/:id", getById);

// Create indication
router.post("/create", createIndication);

// Delete indication - ИСПРАВЛЕНО: используем DELETE метод
router.delete("/:id", deleteIndication);

// Delete all indications
router.delete("/", deleteAllIndications);

export default router;
