import express from 'express';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import passport from './config/passport.js';
import { corsMiddleware } from './middleware/corsMiddleware.js';
// import arcjetMiddleware from './middleware/arcjetMiddleware.js';
import { config as env } from './config/env.js';

import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import fabricRoutes from './routes/fabricRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import designRoutes from './routes/designRoutes.js';
import renderRoutes from './routes/renderRoutes.js';
import commentRoutes from './routes/commentRoutes.js';





import { swaggerUi, specs } from './config/swagger.js';

const app = express();

app.set('trust proxy', 1);

// Security & Performance
app.use(helmet());
app.use(compression());
// app.use(arcjetMiddleware); // Arcjet middleware for security and rate limiting

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
app.use('/api/orders', orderRoutes);
app.use('/api/fabrics', fabricRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/designs', designRoutes);
app.use('/api/render', renderRoutes);
app.use('/api/comments', commentRoutes);

// Health check
app.get('/', (_, res) => res.send('TFB Studios API is live'));

export default app;
