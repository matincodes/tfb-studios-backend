// src/routes/commentRoutes.js
import express from 'express';
import { isAuth } from '../middleware/isAuth.js';
import {
  httpAddComment,
  httpGetCommentsForDesign,
  httpGetCommentsForRenderedDesign
} from '../controllers/commentController.js';

const router = express.Router();

// Add a comment to a design or rendered design
router.post('/', isAuth, httpAddComment);

// Get all comments for a design
router.get('/design/:id', isAuth, httpGetCommentsForDesign);

// Get all comments for a rendered design
router.get('/rendered/:id', isAuth, httpGetCommentsForRenderedDesign);

export default router;
