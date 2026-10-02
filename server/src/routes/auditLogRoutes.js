import express from "express";

import {
  getAllAuditLogs,
} from "../controllers/auditLogController.js";

import {
  protect,
  requireRole,
} from "../middleware/authMiddleware.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| Get All Audit Logs
|--------------------------------------------------------------------------
| Admin only.
*/

router.get(
  "/",
  protect,
  requireRole("ADMIN"),
  getAllAuditLogs
);

export default router;