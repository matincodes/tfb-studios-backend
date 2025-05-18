
import express from 'express';
import { mockAIRecommendFabric } from '../controllers/aiController.js';
import { isAuth } from '../middleware/isAuth.js';

const router = express.Router();

/**
 * @swagger
 * /api/ai/fabric-recommendation:
 *   post:
 *     summary: Mock AI fabric suggestion based on input
 *     tags: [AI]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               designType: { type: string }
 *               season: { type: string }
 *               useCase: { type: string }
 *     responses:
 *       200:
 *         description: Recommended fabric list
 */
router.post('/fabric-recommendation', isAuth, mockAIRecommendFabric);

export default router;
