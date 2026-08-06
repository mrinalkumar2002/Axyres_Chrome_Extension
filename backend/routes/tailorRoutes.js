import express from "express";
import { tailorResumeController } from "../controllers/tailorResumeController.js";

const router = express.Router();

/**
 * ===========================================
 * Resume Tailoring Routes
 * Base URL: /api/tailor
 * ===========================================
 */

/**
 * POST /api/tailor
 *
 * Request Body:
 * {
 *   "resume": { ... },
 *   "job": { ... }
 * }
 */
router.post("/", tailorResumeController);

export default router;