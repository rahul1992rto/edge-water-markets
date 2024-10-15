// src/auth/auth.controller.ts

import { Request, Response  , NextFunction} from 'express';
import jwt from 'jsonwebtoken';

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { username, password } = req.body;

    try {
       // Dummy credentials for demonstration
    if (username === 'testuser' && password === 'testpass') {
        const user = { username }; // Payload for JWT

        // Sign the token with user payload and secret key
        const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } else {
        res.status(401).json({ error: 'Invalid username or password' });
    }
    } catch (error) {
         res.status(500).json({ message: 'Internal server error', error });
    }
};
