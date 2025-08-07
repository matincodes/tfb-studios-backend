// src/middleware/corsMiddleware.js
import cors from 'cors';
import {config as env} from '../config/env.js';

// Define the allowed origin. For development, this is your Next.js frontend URL.
// For production, you would change this to 'https://www.tfbstudios.com'
const allowedOrigins = ['http://localhost:3000', 'https://frontend.tfbstudios.com'];

const corsOptions = {
  // The origin property must be set to your specific frontend URL. A wildcard ('*') will not work for credentials.
  origin: (origin, callback) => {
    // allow requests with no origin (like mobile apps or curl requests)
    // if (!origin) return callback(null, true);
    // if (allowedOrigins.indexOf(origin) === -1) {
    //   const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
    //   return callback(new Error(msg), false);
    // }
    // return callback(null, true);
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error('CORS blocked this origin'), false);
  },
  credentials: true,
  exposedHeaders: ['Set-Cookie'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  optionsSuccessStatus: 200
};

export const corsMiddleware = cors(corsOptions);
