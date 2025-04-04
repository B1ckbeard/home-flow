import { Router } from "express";
import { register, login, getUsers, getUserObjects } from '../controllers/auth.js';

const router = new Router();

// register
// http://localhost:3001/api/auth/register
router.post('/register', register)

// register
// http://localhost:3001/api/auth/login
router.post('/login', login)

// get users
// http://localhost:3001/api/auth/users
router.get('/users', getUsers)

// get user's objects
// http://localhost:3001/api/auth/objects/:id
router.get('/objects/:id', getUserObjects)

export default router
