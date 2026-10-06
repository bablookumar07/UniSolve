import mongoose from "mongoose";

const CASE_TYPES = [
  "CAMPUS",
  "ACADEMIC",
  "IT",
  "ADMINISTRATIVE",
  "TRANSPORT",
  "LIBRARY",
  "SAFETY",
  "OTHER",
];

const CASE_STATUSES = [
  "PENDING",
  "ASSIGNED",
  "IN_PROGRESS",
  "RESOLVED",
  "REOPENED",
  "CLOSED",
];

const PRIORITIES = [
  "LOW",
  "MEDIUM",
  "HIGH",
  "CRITICAL",
];

const evidenceSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
      trim: true,
    },
    publicId: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { _id: false }
);

const caseSchema = new mongoose.Schema(
  {
    caseId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },

    caseType: {
      type: String,
      required: true,
      enum: {
        values: CASE_TYPES,
        message: "Invalid case type",
      },
      index: true,
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
      index: true,
    },

    subcategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null,
    },

    title: {
      type: String,
      required: [true, "Case title is required"],
      trim: true,
      minlength: [5, "Title must be at least 5 characters"],
      maxlength: [150, "Title cannot exceed 150 characters"],
    },

    description: {
      type: String,
      required: [true, "Case description is required"],
      trim: true,
      minlength: [10, "Description must be at least 10 characters"],
      maxlength: [3000, "Description cannot exceed 3000 characters"],
    },

    priority: {
      type: String,
      enum: PRIORITIES,
      default: "MEDIUM",
      index: true,
    },

    status: {
      type: String,
      enum: CASE_STATUSES,
      default: "PENDING",
      index: true,
    },

    location: {
      type: String,
      trim: true,
      maxlength: [200, "Location cannot exceed 200 characters"],
      default: null,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },

    isAnonymous: {
      type: Boolean,
      default: false,
    },

    evidence: {
      type: [evidenceSchema],
      default: [],
    },

    resolution: {
      notes: {
        type: String,
        trim: true,
        maxlength: 3000,
        default: null,
      },

      reopenReason: {
        type: String,
        trim: true,
        maxlength: 1000,
        default: null,
      },

      evidence: {
        type: [evidenceSchema],
        default: [],
      },
    },

    resolvedAt: {
      type: Date,
      default: null,
    },

    closedAt: {
      type: Date,
      default: null,
    },

    reopenedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

caseSchema.index({
  createdBy: 1,
  createdAt: -1,
});

caseSchema.index({
  assignedTo: 1,
  status: 1,
});

caseSchema.index({
  caseType: 1,
  category: 1,
  status: 1,
});

caseSchema.index({
  priority: 1,
  status: 1,
});

const Case = mongoose.model("Case", caseSchema);

export default Case;