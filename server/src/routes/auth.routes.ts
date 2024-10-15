// src/auth/auth.routes.ts

import express from 'express';
import { login } from '../controllers/auth.controller';

const router = express.Router();

// POST /auth/login
router.post('/login', login);

export default router;
