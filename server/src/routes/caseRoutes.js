import express from "express";
import {
  createCase,
  getMyCases,
  getCaseById,
  getAllCases,
   getActiveStaff,
  assignCase,
  getAssignedCases,
  startCase,
  resolveCase,
  closeCase,
reopenCase,
} from "../controllers/caseController.js";

import {
  protect,
  requireRole,
} from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createCase);

router.get("/my", protect, getMyCases);

router.get(
  "/staff",
  protect,
  requireRole("ADMIN"),
  getActiveStaff
);

router.get(
  "/",
  protect,
  requireRole("ADMIN"),
  getAllCases
);

router.put(
  "/:id/assign",
  protect,
  requireRole("ADMIN"),
  assignCase
);

router.put(
  "/:id/start",
  protect,
  requireRole("STAFF"),
  startCase
);

router.put(
  "/:id/resolve",
  protect,
  requireRole("STAFF"),
  resolveCase
);

router.get(
  "/assigned",
  protect,
  requireRole("STAFF"),
  getAssignedCases
);

router.put(
  "/:id/close",
  protect,
  requireRole("STUDENT"),
  closeCase
);

router.put(
  "/:id/reopen",
  protect,
  requireRole("STUDENT"),
  reopenCase
);

router.get("/:id", protect, getCaseById);

export default router;