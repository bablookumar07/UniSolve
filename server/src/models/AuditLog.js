import mongoose from "mongoose";

const auditLogSchema = new mongoose.Schema(
  {
    complaint: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Complaint",
      required: true,
    },

    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    action: {
      type: String,
      enum: [
        "CREATED",
        "ASSIGNED",
        "STARTED",
        "RESOLVED",
        "REOPENED",
        "CLOSED",
      ],
      required: true,
    },

    previousStatus: {
      type: String,
      default: null,
    },

    newStatus: {
      type: String,
      default: null,
    },

    details: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
  },
  {
    timestamps: true,
  }
);

auditLogSchema.index({ complaint: 1, createdAt: -1 });
auditLogSchema.index({ performedBy: 1, createdAt: -1 });
auditLogSchema.index({ action: 1 });

const AuditLog = mongoose.model("AuditLog", auditLogSchema);

export default AuditLog;