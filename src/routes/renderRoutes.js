// src/routes/renderRoutes.js
import express from 'express';
import { isAuth } from '../middleware/isAuth.js';
import { requireRole } from '../middleware/requireRole.js';
import upload from '../config/multer.js';
import {
    // Admin functions
    httpGetDesignsAwaitingRender,
    httpAdminUploadRender,
    httpAdminRejectSketch,
    httpAdminDeleteRender,
    // User functions
    httpGetUserRendersForSketch,
    httpUserAcceptRender,
    httpUserRejectRender,
} from '../controllers/renderController.js';

// This controller handles all routes for rendered designs
const renderRouter = express.Router();

// --- Admin Routes ---
renderRouter.get('/admin/awaiting-sketch', isAuth, requireRole('ADMIN'), httpGetDesignsAwaitingRender);
renderRouter.post('/admin/:designId/upload', isAuth, requireRole('ADMIN'), upload.single('renderImage'), httpAdminUploadRender);
renderRouter.delete('/admin/sketch/:sketchId/reject', isAuth, requireRole('ADMIN'), httpAdminRejectSketch);
renderRouter.delete('/admin/:renderedDesignId', isAuth, requireRole('ADMIN'), httpAdminDeleteRender);

// --- User Routes ---
renderRouter.get('/sketch/:designId', isAuth, httpGetUserRendersForSketch);
renderRouter.post('/:renderedDesignId/accept', isAuth, httpUserAcceptRender);
renderRouter.post('/:renderedDesignId/reject', isAuth, httpUserRejectRender);

export default renderRouter;