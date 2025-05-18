// src/routes/renderRoutes.js
import express from 'express';
import upload from '../config/multer.js';
import { isAuth } from '../middleware/isAuth.js';
import { requireRole } from '../middleware/requireRole.js';
import {
  httpGetPendingDesigns,
  httpUploadRender,
  httpRejectDesign,
} from '../controllers/renderController.js';

const router = express.Router();

router.get('/pending', isAuth, requireRole('MODERATOR'), httpGetPendingDesigns);
router.put('/:id/render', isAuth, requireRole('MODERATOR'), upload.single('image'), httpUploadRender);
router.patch('/:id/reject', isAuth, requireRole('MODERATOR'), httpRejectDesign);

export default router;
