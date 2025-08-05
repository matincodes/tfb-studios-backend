// src/routes/designRoutes.js
import express from 'express';
import upload from '../config/multer.js';
import { isAuth } from '../middleware/isAuth.js';
// --- 1. Import the new controller functions ---
import {
  httpCreateDesign,
  httpGetMyDesigns,
  httpGetDesignById,
  httpDeleteDesign
} from '../controllers/designController.js';

const router = express.Router();


// --- Core Routes for Managing Designs (Sketches) ---

router.post('/', isAuth, upload.array('images', 10), httpCreateDesign); // User creates a sketch
router.get('/mine', isAuth, httpGetMyDesigns); // User gets a list of their sketches
router.get('/:id', isAuth, httpGetDesignById); // User gets a single sketch they own
router.delete('/:id', isAuth, httpDeleteDesign); // User deletes their own sketch



export default router;