import { Router } from "express";
import { getAll, createIndication, deleteIndication, deleteAllIndications, getById } from '../controllers/indications.js';

const router = new Router()

// Get All indications
// http://localhost:3001/api/indications
router.get('/', getAll)

// Create Indication
// http://localhost:3001/api/indications/create
router.post('/create', createIndication)

// Delete
// http://localhost:3001/api/indications/delete/:id
router.post('/delete/:id', deleteIndication)

// Delete All
// http://localhost:3001/api/indications/delete/all
router.get('/delete/all', deleteAllIndications)

// Get By Id
// http://localhost:3002/api/indications/:id
router.get('/:id', getById)

export default router
