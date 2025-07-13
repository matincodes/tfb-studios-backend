// src/middleware/corsMiddleware.js
import cors from 'cors';
import {config as env} from '../config/env.js';

// Define the allowed origin. For development, this is your Next.js frontend URL.
// For production, you would change this to 'https://www.tfbstudios.com'
const allowedOrigins = ['http://localhost:3000'];

const corsOptions = {
  // The origin property must be set to your specific frontend URL. A wildcard ('*') will not work for credentials.
  origin: (origin, callback) => {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  // This header is ESSENTIAL for the browser to accept cookies from the backend.
  credentials: true,
  // You can also specify other options if needed
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

export const corsMiddleware = cors(corsOptions);
