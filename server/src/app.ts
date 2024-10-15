// src/app.ts
import express from 'express';
import corsOptions from './config/corsConfig';
import { login } from './controllers/auth.controller';

const app = express();

app.use(corsOptions);
app.use(express.json());
app.post('/api/login', login);

export default app;
