// src/middleware/corsMiddleware.js
import cors from 'cors';
import { config } from '../config/env.js';

const allowedOrigins = [
  config.CLIENT_URL,
  'http://localhost:3000',
  'https://tfbstudios.com',
];

export const corsMiddleware = cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // allow cookies
});
