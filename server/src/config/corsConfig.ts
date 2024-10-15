// src/config/corsConfig.ts
import cors from 'cors';

export const corsOptions = {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true,
};

export default cors(corsOptions);
