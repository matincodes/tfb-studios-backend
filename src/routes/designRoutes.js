// src/routes/designRoutes.js
import express from 'express';
import upload from '../config/multer.js';
import { isAuth } from '../middleware/isAuth.js';
import {
  httpCreateDesign,
  httpGetMyDesigns,
  httpGetAvailableDesigns,
  httpGetDesignById,
  httpDeleteDesign,
} from '../controllers/designController.js';

const router = express.Router();

router.post('/', isAuth, upload.single('image'), httpCreateDesign);
router.get('/mine', isAuth, httpGetMyDesigns);
router.get('/available-for-order', httpGetAvailableDesigns);
router.get('/:id', httpGetDesignById);
router.delete('/:id', isAuth, httpDeleteDesign);

export default router;
