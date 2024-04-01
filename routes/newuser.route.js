import express from 'express';
import { register, getAllNewUsers, deletenewuser } from '../controllers/newuser.controller.js';

import { verifyToken } from "../middleware/jwt.js";
const router = express.Router();

// POST route for user registration
router.post('/register', register);

// GET route to load all new users
router.get('/getAllNewUsers', getAllNewUsers);

router.delete("/:id", verifyToken, deletenewuser);
export default router;
