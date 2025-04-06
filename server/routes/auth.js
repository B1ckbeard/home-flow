import { Router } from "express";
import { register, login, getUsers, getUserObjects } from '../controllers/auth.js';

const router = new Router();

// register
// http://localhost:3001/api/auth/register
// поменять на http://localhost:3001/api/users/register
router.post('/register', register)

// register
// http://localhost:3001/api/auth/login
// поменять на http://localhost:3001/api/users/login
router.post('/login', login)

// get users
// http://localhost:3001/api/auth/users
// поменять на http://localhost:3001/api/users
router.get('/users', getUsers)

// get user's objects
// http://localhost:3001/api/auth/objects/:id
// поменять на http://localhost:3001/api/users/:id/objects
router.get('/objects/:id', getUserObjects)

export default router
