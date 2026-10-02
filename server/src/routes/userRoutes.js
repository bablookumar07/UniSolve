import express from "express";

import {
  adminTest,
  getCurrentUser,
  getStaffUsers,
  getAllUsers,
  toggleUserStatus,
} from "../controllers/userController.js";

import {
  protect,
  requireRole,
} from "../middleware/authMiddleware.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| Current User
|--------------------------------------------------------------------------
*/

router.get(
  "/me",
  protect,
  getCurrentUser
);

/*
|--------------------------------------------------------------------------
| Active Staff Users
|--------------------------------------------------------------------------
| Used by Admin for complaint assignment.
*/

router.get(
  "/staff",
  protect,
  requireRole("ADMIN"),
  getStaffUsers
);

/*
|--------------------------------------------------------------------------
| All Users
|--------------------------------------------------------------------------
| Admin only.
*/

router.get(
  "/",
  protect,
  requireRole("ADMIN"),
  getAllUsers
);

/*
|--------------------------------------------------------------------------
| Toggle User Status
|--------------------------------------------------------------------------
| Admin only.
*/

router.patch(
  "/:id/status",
  protect,
  requireRole("ADMIN"),
  toggleUserStatus
);

/*
|--------------------------------------------------------------------------
| Admin Authorization Test
|--------------------------------------------------------------------------
*/

router.get(
  "/admin-test",
  protect,
  requireRole("ADMIN"),
  adminTest
);

export default router;