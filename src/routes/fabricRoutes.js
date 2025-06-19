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
router.get('/', isAuth, httpGetAllFabrics);
router.get('/:id', httpGetFabricById);
router.post('/', isAuth, upload.single('image'), httpCreateFabric);
router.put('/:id', isAuth, upload.single('image'), httpUpdateFabric);
router.delete('/:id', isAuth, httpDeleteFabric);

export default router;
