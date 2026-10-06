import express from "express";
import { createCase } from "../controllers/caseController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Create a new case
router.post("/", protect, createCase);

export default router;