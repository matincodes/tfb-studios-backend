import express from 'express';
import upload from '../config/multer.js';
import { isAuth } from '../middleware/isAuth.js';
import { requireRole } from '../middleware/requireRole.js';
import {
  httpCreateFabric,
  httpGetAllFabrics,
  httpGetFabricById,
  httpUpdateFabric,
  httpDeleteFabric,
} from '../controllers/fabricController.js';

const router = express.Router();

// Public
router.get('/', httpGetAllFabrics);
router.get('/:id', httpGetFabricById);

// Admin only
router.post('/', isAuth, requireRole('ADMIN'), upload.single('image'), httpCreateFabric);
router.put('/:id', isAuth, requireRole('ADMIN'), upload.single('image'), httpUpdateFabric);
router.delete('/:id', isAuth, requireRole('ADMIN'), httpDeleteFabric);

export default router;
