import mongoose from "mongoose";

const complaintSchema = new mongoose.Schema(
  {
    complaintId: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },

    title: {
      type: String,
      required: [true, "Complaint title is required"],
      trim: true,
      minlength: [5, "Title must be at least 5 characters"],
      maxlength: [100, "Title cannot exceed 100 characters"],
    },

    description: {
      type: String,
      required: [true, "Complaint description is required"],
      trim: true,
      minlength: [10, "Description must be at least 10 characters"],
      maxlength: [2000, "Description cannot exceed 2000 characters"],
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Complaint category is required"],
    },

    priority: {
      type: String,
      enum: ["LOW", "MEDIUM", "HIGH", "CRITICAL"],
      default: "MEDIUM",
    },

    status: {
      type: String,
      enum: [
        "PENDING",
        "ASSIGNED",
        "IN_PROGRESS",
        "RESOLVED",
        "REOPENED",
        "CLOSED",
      ],
      default: "PENDING",
    },

    location: {
      type: String,
      required: [true, "Complaint location is required"],
      trim: true,
      maxlength: [150, "Location cannot exceed 150 characters"],
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    isAnonymous: {
      type: Boolean,
      default: false,
    },

    evidence: [
      {
        url: {
          type: String,
          trim: true,
        },
        publicId: {
          type: String,
          trim: true,
        },
      },
    ],

    resolution: {
  notes: {
    type: String,
    trim: true,
    maxlength: [2000, "Resolution notes cannot exceed 2000 characters"],
  },

  reopenReason: {
    type: String,
    trim: true,
    maxlength: [1000, "Reopen reason cannot exceed 1000 characters"],
    default: null,
  },

  evidence: [
    {
      url: {
        type: String,
        trim: true,
      },
      publicId: {
        type: String,
        trim: true,
      },
    },
  ],
},
      

    resolvedAt: {
      type: Date,
      default: null,
    },

    closedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

complaintSchema.index({ createdBy: 1 });
complaintSchema.index({ assignedTo: 1 });
complaintSchema.index({ status: 1 });
complaintSchema.index({ priority: 1 });
complaintSchema.index({ category: 1 });

const Complaint = mongoose.model("Complaint", complaintSchema);

export default Complaint;