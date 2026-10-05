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

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      unique: true,
      trim: true,
      uppercase: true,
      maxlength: [50, "Category name cannot exceed 50 characters"],
    },

    description: {
      type: String,
      trim: true,
      maxlength: [200, "Description cannot exceed 200 characters"],
    },

    caseType: {
      type: String,
      enum: {
        values: CASE_TYPES,
        message: "Invalid case type",
      },
      default: "CAMPUS",
      required: true,
    },

    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

categorySchema.index({ caseType: 1 });
categorySchema.index({ parent: 1 });
categorySchema.index({ caseType: 1, parent: 1 });

const Category = mongoose.model("Category", categorySchema);

export default Category;