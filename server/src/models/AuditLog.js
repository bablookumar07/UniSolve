import mongoose from "mongoose";

const auditLogSchema = new mongoose.Schema(
  {
    // Existing Complaint reference
    complaint: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Complaint",
      default: null,
    },

    // New generic Case reference
    case: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Case",
      default: null,
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

// Complaint audit queries
auditLogSchema.index({
  complaint: 1,
  createdAt: -1,
});

// Case audit queries
auditLogSchema.index({
  case: 1,
  createdAt: -1,
});

// User activity
auditLogSchema.index({
  performedBy: 1,
  createdAt: -1,
});

// Action filtering
auditLogSchema.index({
  action: 1,
});

const AuditLog = mongoose.model("AuditLog", auditLogSchema);

export default AuditLog;