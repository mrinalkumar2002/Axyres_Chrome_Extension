import express from "express";
import { pdfController } from "../controllers/pdfController.js";

const router = express.Router();

/**
 * ===========================================
 * PDF Routes
 * Base URL: /api/pdf
 * ===========================================
 */

/**
 * POST /api/pdf
 *
 * Request Body:
 * {
 *   "resume": { ... }
 * }
 */
router.post("/", pdfController);

export default router;