import Case from "../models/Case.js";
import Category from "../models/Category.js";
import AuditLog from "../models/AuditLog.js";

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

const PRIORITIES = ["LOW", "MEDIUM", "HIGH", "CRITICAL"];

/**
 * Generate unique Case ID
 * Example: CASE-1760123456789
 */
const generateCaseId = () => {
  return `CASE-${Date.now()}`;
};

/**
 * Create a new Case
 * POST /api/cases
 * Protected
 */
export const createCase = async (req, res) => {
  try {
    const {
      caseType,
      category,
      subcategory,
      title,
      description,
      priority,
      location,
      isAnonymous,
      evidence,
    } = req.body;

    // --------------------------------------------------
    // 1. Basic validation
    // --------------------------------------------------

    if (!caseType) {
      return res.status(400).json({
        success: false,
        message: "Case type is required",
      });
    }

    if (!CASE_TYPES.includes(caseType)) {
      return res.status(400).json({
        success: false,
        message: "Invalid case type",
      });
    }

    if (!category) {
      return res.status(400).json({
        success: false,
        message: "Category is required",
      });
    }

    if (!title || title.trim().length < 5) {
      return res.status(400).json({
        success: false,
        message: "Title must be at least 5 characters",
      });
    }

    if (!description || description.trim().length < 10) {
      return res.status(400).json({
        success: false,
        message: "Description must be at least 10 characters",
      });
    }

    if (priority && !PRIORITIES.includes(priority)) {
      return res.status(400).json({
        success: false,
        message: "Invalid priority",
      });
    }

    // --------------------------------------------------
    // 2. Validate main category
    // --------------------------------------------------

    const categoryDoc = await Category.findOne({
      _id: category,
      isActive: true,
    });

    if (!categoryDoc) {
      return res.status(400).json({
        success: false,
        message: "Invalid or inactive category",
      });
    }

    // Category must belong to selected case type
    if (categoryDoc.caseType !== caseType) {
      return res.status(400).json({
        success: false,
        message: "Category does not belong to selected case type",
      });
    }

    // --------------------------------------------------
    // 3. Validate subcategory
    // --------------------------------------------------

    let subcategoryDoc = null;

    if (subcategory) {
      subcategoryDoc = await Category.findOne({
        _id: subcategory,
        isActive: true,
      });

      if (!subcategoryDoc) {
        return res.status(400).json({
          success: false,
          message: "Invalid or inactive subcategory",
        });
      }

      // Same case type
      if (subcategoryDoc.caseType !== caseType) {
        return res.status(400).json({
          success: false,
          message: "Subcategory does not belong to selected case type",
        });
      }

      // Subcategory must belong to selected category
      if (
        !subcategoryDoc.parent ||
        subcategoryDoc.parent.toString() !== categoryDoc._id.toString()
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Selected subcategory does not belong to selected category",
        });
      }
    }

    // --------------------------------------------------
    // 4. Create Case
    // --------------------------------------------------

    const newCase = await Case.create({
      caseId: generateCaseId(),

      caseType,

      category: categoryDoc._id,

      subcategory: subcategoryDoc
        ? subcategoryDoc._id
        : null,

      title: title.trim(),

      description: description.trim(),

      priority: priority || "MEDIUM",

      status: "PENDING",

      location: location?.trim() || null,

      createdBy: req.user._id,

      assignedTo: null,

      isAnonymous: Boolean(isAnonymous),

      evidence: Array.isArray(evidence) ? evidence : [],
    });

    // --------------------------------------------------
    // 5. Create Audit Log
    // --------------------------------------------------

    await AuditLog.create({
      action: "CASE_CREATED",
      performedBy: req.user._id,
      targetType: "CASE",
      targetId: newCase._id,
      metadata: {
        caseId: newCase.caseId,
        caseType: newCase.caseType,
        category: categoryDoc.name,
        subcategory: subcategoryDoc?.name || null,
        priority: newCase.priority,
      },
    });

    // --------------------------------------------------
    // 6. Populate response
    // --------------------------------------------------

    const populatedCase = await Case.findById(newCase._id)
      .populate("category", "name description caseType parent")
      .populate("subcategory", "name description caseType parent")
      .populate("createdBy", "name email role");

    // --------------------------------------------------
    // 7. Response
    // --------------------------------------------------

    return res.status(201).json({
      success: true,
      message: "Case created successfully",
      data: populatedCase,
    });
  } catch (error) {
    console.error("Create Case Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create case",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : undefined,
    });
  }
};