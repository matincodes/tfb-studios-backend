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

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Create a new order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/OrderInput'
 *     responses:
 *       201:
 *         description: Order created
 *       400:
 *         description: Bad request
 */
router.post('/', isAuth, httpCreateOrder);

/**
 * @swagger
 * /orders/my:
 *   get:
 *     summary: Get orders for the authenticated user
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user's orders
 */
router.get('/my', isAuth, httpGetMyOrders);

/**
 * @swagger
 * /orders/{id}:
 *   get:
 *     summary: Get order by ID (user)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Order details
 *       404:
 *         description: Order not found
 */
router.get('/:id', isAuth, httpGetOrderById);

/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Get all orders (admin)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all orders
 *       403:
 *         description: Forbidden
 */
router.get('/', isAuth, requireRole('ADMIN'), httpGetAllOrders);

/**
 * @swagger
 * /orders/stats:
 *   get:
 *     summary: Get order statistics (admin)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Order statistics
 *       403:
 *         description: Forbidden
 */
router.get('/stats', isAuth, requireRole('ADMIN'), httpGetOrderStats);

/**
 * @swagger
 * /orders/{id}/status:
 *   patch:
 *     summary: Update order status (admin)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Order status updated
 *       403:
 *         description: Forbidden
 */
router.patch('/:id/status', isAuth, requireRole('ADMIN'), httpUpdateOrderStatus);

/**
 * @swagger
 * /orders/{id}/tracking:
 *   patch:
 *     summary: Update order tracking info (admin)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               trackingNumber:
 *                 type: string
 *     responses:
 *       200:
 *         description: Tracking info updated
 *       403:
 *         description: Forbidden
 */
router.patch('/:id/tracking', isAuth, requireRole('ADMIN'), httpUpdateTracking);

/**
 * @swagger
 * /orders/{id}:
 *   delete:
 *     summary: Delete an order (admin)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Order deleted
 *       403:
 *         description: Forbidden
 */
router.delete('/:id', isAuth, requireRole('ADMIN'), httpDeleteOrder);

export default router;
