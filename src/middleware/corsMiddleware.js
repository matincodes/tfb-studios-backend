// src/middleware/corsMiddleware.js
import cors from 'cors';

// Define the allowed origin. For development, this is your Next.js frontend URL.
// For production, you would change this to 'https://www.tfbstudios.com'
const allowedOrigins = ['https://frontend.tfbstudios.com','http://localhost:3000', "https://tfb-studios-frontend.up.railway.app"];

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
    // if (!origin) return callback(null, true);
    // if (allowedOrigins.includes(origin)) return callback(null, true);
    // callback(new Error('CORS blocked this origin'), false);
  },
  credentials: true,
  exposedHeaders: ['Set-Cookie'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  optionsSuccessStatus: 200
};

export const corsMiddleware = cors(corsOptions);

// const allowedOrigins = ['http://localhost:3000', 'https://frontend.tfbstudios.com'];

// export const corsMiddleware = (req, res, next) => {
//   const origin = req.headers.origin;

//   if (allowedOrigins.includes(origin)) {
//     res.setHeader('Access-Control-Allow-Origin', origin);
//     res.setHeader('Access-Control-Allow-Credentials', 'true');
//   }

//   res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
//   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');

//   if (req.method === 'OPTIONS') {
//     return res.sendStatus(204);
//   }
//   next();
// };
