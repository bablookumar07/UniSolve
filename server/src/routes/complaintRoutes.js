import express from "express";

import {
  createComplaint,
  getMyComplaints,
  getComplaintById,
  getAllComplaints,
  assignComplaint,
  getAssignedComplaints,
  startComplaint,
  resolveComplaint,
  closeComplaint,
  reopenComplaint,
} from "../controllers/complaintController.js";

import {
  protect,
  requireRole,
} from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, requireRole("STUDENT"), createComplaint);

router.get("/my", protect, requireRole("STUDENT"), getMyComplaints);

router.get(
  "/assigned",
  protect,
  requireRole("STAFF"),
  getAssignedComplaints
);

router.get("/", protect, requireRole("ADMIN"), getAllComplaints);

router.patch(
  "/:id/assign",
  protect,
  requireRole("ADMIN"),
  assignComplaint
);

router.patch(
  "/:id/start",
  protect,
  requireRole("STAFF"),
  startComplaint
);

router.patch(
  "/:id/resolve",
  protect,
  requireRole("STAFF"),
  resolveComplaint
);

router.patch(
  "/:id/close",
  protect,
  requireRole("STUDENT"),
  closeComplaint
);

router.patch(
  "/:id/reopen",
  protect,
  requireRole("STUDENT"),
  reopenComplaint
);

router.get(
  "/:id",
  protect,
  requireRole("STUDENT"),
  getComplaintById
);

export default router;