import express from "express";
import {
  createCase,
  getMyCases,
  getCaseById,
} from "../controllers/caseController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Create case
router.post("/", protect, createCase);

// Get logged-in user's cases
router.get("/my", protect, getMyCases);

// Get case by ID
router.get("/:id", protect, getCaseById);

export default router;