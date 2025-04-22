import express from 'express';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import passport from './config/passport.js';
import { corsMiddleware } from './middleware/corsMiddleware.js';
import { config as env } from './config/env.js';

import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import { swaggerUi, specs } from './config/swagger.js';

const app = express();

// Security & Performance
app.use(helmet());
app.use(compression());

// CORS & Cookies
app.use(corsMiddleware);
app.use(cookieParser());

// Logging
app.use(morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// Parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Auth
app.use(passport.initialize());

// Docs
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(specs));

//  Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// Health check
app.get('/', (_, res) => res.send('TFB Studios API is live'));

export default app;
