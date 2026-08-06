import express from "express";
import { extractController } from "../controllers/extractController.js"

const router = express.Router();

router.post("/", extractController)

export default router;