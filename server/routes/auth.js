import { Router } from "express";
import { register, login } from '../controllers/auth.js';

const router = new Router();

// register
// http://localhost:3001/api/auth/register
router.post('/register', register)

// register
// http://localhost:3001/api/auth/login
router.post('/login', login)

export default router
