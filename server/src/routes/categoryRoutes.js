import express from "express";

import {
  getActiveCategories,
  getAllCategories,
  createCategory,
  updateCategory,
  toggleCategoryStatus,
} from "../controllers/categoryController.js";

import {
  protect,
  requireRole,
} from "../middleware/authMiddleware.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| Active Categories
|--------------------------------------------------------------------------
| Used by students.
*/

router.get(
  "/",
  protect,
  getActiveCategories
);

/*
|--------------------------------------------------------------------------
| Admin Category Management
|--------------------------------------------------------------------------
*/

router.get(
  "/admin",
  protect,
  requireRole("ADMIN"),
  getAllCategories
);

router.post(
  "/",
  protect,
  requireRole("ADMIN"),
  createCategory
);

router.patch(
  "/:id",
  protect,
  requireRole("ADMIN"),
  updateCategory
);

router.patch(
  "/:id/status",
  protect,
  requireRole("ADMIN"),
  toggleCategoryStatus
);

export default router;