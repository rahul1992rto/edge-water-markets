// src/middleware/jwtAuth.ts
import jwt  from 'jsonwebtoken';

export const verifyToken = (token: string) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch {
        return null;
    }
};
