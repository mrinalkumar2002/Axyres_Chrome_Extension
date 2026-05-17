import express from "express";
import { extractJob } from "../controllers/extractController.js";

const router = express.Router();

router.post("/", extractJob);

export default router;