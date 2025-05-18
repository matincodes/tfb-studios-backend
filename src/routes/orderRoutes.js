import express from 'express';
import { isAuth } from '../middleware/isAuth.js';
import { requireRole } from '../middleware/requireRole.js';
import {
  httpCreateOrder,
  httpGetMyOrders,
  httpGetAllOrders,
  httpGetOrderById,
  httpUpdateOrderStatus,
  httpUpdateTracking,
  httpDeleteOrder,
  httpGetOrderStats,
} from '../controllers/orderController.js';

const router = express.Router();

/* user */
router.post('/', isAuth, httpCreateOrder);
router.get('/my', isAuth, httpGetMyOrders);
router.get('/:id', isAuth, httpGetOrderById);

/* admin */
router.get('/', isAuth, requireRole('ADMIN'), httpGetAllOrders);
router.get('/stats', isAuth, requireRole('ADMIN'), httpGetOrderStats);
router.patch('/:id/status', isAuth, requireRole('ADMIN'), httpUpdateOrderStatus);
router.patch('/:id/tracking', isAuth, requireRole('ADMIN'), httpUpdateTracking);
router.delete('/:id', isAuth, requireRole('ADMIN'), httpDeleteOrder);

export default router;
