import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    complaint: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Complaint",
      default: null,
    },

    type: {
      type: String,
      enum: [
        "COMPLAINT_CREATED",
        "COMPLAINT_ASSIGNED",
        "COMPLAINT_STARTED",
        "COMPLAINT_RESOLVED",
        "COMPLAINT_REOPENED",
        "COMPLAINT_CLOSED",
      ],
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },

    isRead: {
      type: Boolean,
      default: false,
    },

    readAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

notificationSchema.index({ recipient: 1, createdAt: -1 });
notificationSchema.index({ recipient: 1, isRead: 1 });
notificationSchema.index({ complaint: 1 });

const Notification = mongoose.model(
  "Notification",
  notificationSchema
);

export default Notification;