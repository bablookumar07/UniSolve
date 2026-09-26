import express from "express";

import {
  adminTest,
  getCurrentUser,
} from "../controllers/userController.js";

import {
  protect,
  requireRole,
} from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/me", protect, getCurrentUser);

router.get(
  "/admin-test",
  protect,
  requireRole("ADMIN"),
  adminTest
);

export default router;