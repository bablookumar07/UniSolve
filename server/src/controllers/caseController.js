import Case from "../models/Case.js";
import Category from "../models/Category.js";
import User from "../models/User.js";
import createAuditLog from "../utils/createAuditLog.js";

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

   await createAuditLog({
  case: newCase._id,
  performedBy: req.user._id,
  action: "CREATED",
  previousStatus: null,
  newStatus: "PENDING",
  details: `Case ${newCase.caseId} created`,
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

// ============================================================
// GET MY CASES
// GET /api/cases/my
// Protected
// ============================================================

export const getMyCases = async (req, res) => {
  try {
    const cases = await Case.find({
      createdBy: req.user._id,
    })
      .populate("category", "name description caseType parent")
      .populate("subcategory", "name description caseType parent")
      .populate("assignedTo", "name email role")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: cases.length,
      data: cases,
    });
  } catch (error) {
    console.error("Get my cases error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch your cases",
    });
  }
};

// ============================================================
// GET ASSIGNED CASES - STAFF
// GET /api/cases/assigned
// STAFF ONLY
// ============================================================

export const getAssignedCases = async (req, res) => {
  try {
    const cases = await Case.find({
      assignedTo: req.user._id,
    })
      .populate("category", "name description caseType parent")
      .populate("subcategory", "name description caseType parent")
      .populate("createdBy", "name email role")
      .populate("assignedTo", "name email role")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: cases.length,
      data: cases,
    });
  } catch (error) {
    console.error("Get assigned cases error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch assigned cases",
    });
  }
};


// ============================================================
// START CASE - STAFF
// PUT /api/cases/:id/start
// STAFF ONLY
// ============================================================

export const startCase = async (req, res) => {
  try {
    const { id } = req.params;

    // --------------------------------------------------
    // 1. Find case
    // --------------------------------------------------

    const caseData = await Case.findById(id);

    if (!caseData) {
      return res.status(404).json({
        success: false,
        message: "Case not found",
      });
    }

    // --------------------------------------------------
    // 2. Verify assigned staff
    // --------------------------------------------------

    if (
      !caseData.assignedTo ||
      caseData.assignedTo.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "This case is not assigned to you",
      });
    }

    // --------------------------------------------------
    // 3. Validate current status
    // --------------------------------------------------

    if (
      caseData.status !== "ASSIGNED" &&
      caseData.status !== "REOPENED"
    ) {
      return res.status(400).json({
        success: false,
        message: `Case cannot be started from ${caseData.status} status`,
      });
    }

    // --------------------------------------------------
    // 4. Store previous status
    // --------------------------------------------------

    const previousStatus = caseData.status;

    // --------------------------------------------------
    // 5. Start case
    // --------------------------------------------------

    caseData.status = "IN_PROGRESS";

    await caseData.save();

    // --------------------------------------------------
    // 6. Audit log
    // --------------------------------------------------

    await createAuditLog({
      case: caseData._id,
      performedBy: req.user._id,
      action: "STARTED",
      previousStatus,
      newStatus: "IN_PROGRESS",
      details: `Case ${caseData.caseId} started by ${req.user.name}`,
    });

    // --------------------------------------------------
    // 7. Populate response
    // --------------------------------------------------

    const populatedCase = await Case.findById(caseData._id)
      .populate("category", "name description caseType parent")
      .populate("subcategory", "name description caseType parent")
      .populate("createdBy", "name email role")
      .populate("assignedTo", "name email role");

    return res.status(200).json({
      success: true,
      message: "Case started successfully",
      data: populatedCase,
    });
  } catch (error) {
    console.error("Start case error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to start case",
    });
  }
};


// ============================================================
// RESOLVE CASE - STAFF
// PUT /api/cases/:id/resolve
// STAFF ONLY
// ============================================================

export const resolveCase = async (req, res) => {
  try {
    const { id } = req.params;
    const { notes } = req.body;

    // --------------------------------------------------
    // 1. Validate resolution notes
    // --------------------------------------------------

    if (!notes || !notes.trim()) {
      return res.status(400).json({
        success: false,
        message: "Resolution notes are required",
      });
    }

    if (notes.trim().length < 10) {
      return res.status(400).json({
        success: false,
        message: "Resolution notes must be at least 10 characters",
      });
    }

    // --------------------------------------------------
    // 2. Find case
    // --------------------------------------------------

    const caseData = await Case.findById(id);

    if (!caseData) {
      return res.status(404).json({
        success: false,
        message: "Case not found",
      });
    }

    // --------------------------------------------------
    // 3. Verify assigned staff
    // --------------------------------------------------

    if (
      !caseData.assignedTo ||
      caseData.assignedTo.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "This case is not assigned to you",
      });
    }

    // --------------------------------------------------
    // 4. Validate current status
    // --------------------------------------------------

    if (caseData.status !== "IN_PROGRESS") {
      return res.status(400).json({
        success: false,
        message: `Case cannot be resolved from ${caseData.status} status`,
      });
    }

    // --------------------------------------------------
    // 5. Store previous status
    // --------------------------------------------------

    const previousStatus = caseData.status;

    // --------------------------------------------------
    // 6. Save resolution
    // --------------------------------------------------

    caseData.resolution.notes = notes.trim();
    caseData.status = "RESOLVED";
    caseData.resolvedAt = new Date();

    await caseData.save();

    // --------------------------------------------------
    // 7. Audit log
    // --------------------------------------------------

    await createAuditLog({
      case: caseData._id,
      performedBy: req.user._id,
      action: "RESOLVED",
      previousStatus,
      newStatus: "RESOLVED",
      details: `Case ${caseData.caseId} resolved by ${req.user.name}`,
    });

    // --------------------------------------------------
    // 8. Populate response
    // --------------------------------------------------

    const populatedCase = await Case.findById(caseData._id)
      .populate("category", "name description caseType parent")
      .populate("subcategory", "name description caseType parent")
      .populate("createdBy", "name email role")
      .populate("assignedTo", "name email role");

    return res.status(200).json({
      success: true,
      message: "Case resolved successfully",
      data: populatedCase,
    });
  } catch (error) {
    console.error("Resolve case error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to resolve case",
    });
  }
};

// ============================================================
// GET CASE BY ID
// GET /api/cases/:id
// Protected
// ============================================================

export const getCaseById = async (req, res) => {
  try {
    const { id } = req.params;

    const caseData = await Case.findById(id)
      .populate("category", "name description caseType parent")
      .populate("subcategory", "name description caseType parent")
      .populate("createdBy", "name email role")
      .populate("assignedTo", "name email role");

    if (!caseData) {
      return res.status(404).json({
        success: false,
        message: "Case not found",
      });
    }

    const userId = req.user._id.toString();

    // --------------------------------------------------
    // STUDENT
    // Can only view own cases
    // --------------------------------------------------

    if (req.user.role === "STUDENT") {
      if (caseData.createdBy._id.toString() !== userId) {
        return res.status(403).json({
          success: false,
          message: "You do not have permission to view this case",
        });
      }
    }

    // --------------------------------------------------
    // STAFF
    // Can only view cases assigned to them
    // --------------------------------------------------

    if (req.user.role === "STAFF") {
      if (
        !caseData.assignedTo ||
        caseData.assignedTo._id.toString() !== userId
      ) {
        return res.status(403).json({
          success: false,
          message: "This case is not assigned to you",
        });
      }
    }

    // --------------------------------------------------
    // ADMIN
    // Can view any case
    // --------------------------------------------------

    return res.status(200).json({
      success: true,
      data: caseData,
    });
  } catch (error) {
    console.error("Get case by ID error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch case",
    });
  }
};


// ============================================================
// GET ALL CASES - ADMIN
// GET /api/cases
// Protected + ADMIN
// ============================================================

export const getAllCases = async (req, res) => {
  try {
    const {
      search,
      caseType,
      category,
      status,
      priority,
      page = 1,
      limit = 10,
    } = req.query;

    // --------------------------------------------------
    // 1. Build filter
    // --------------------------------------------------

    const filter = {};

    if (caseType) {
      filter.caseType = caseType;
    }

    if (category) {
      filter.category = category;
    }

    if (status) {
      filter.status = status;
    }

    if (priority) {
      filter.priority = priority;
    }

    // --------------------------------------------------
    // 2. Search
    // --------------------------------------------------

    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), "i");

      filter.$or = [
        { caseId: searchRegex },
        { title: searchRegex },
        { description: searchRegex },
      ];
    }

    // --------------------------------------------------
    // 3. Pagination
    // --------------------------------------------------

    const pageNumber = Math.max(Number(page) || 1, 1);
    const limitNumber = Math.min(
      Math.max(Number(limit) || 10, 1),
      100
    );

    const skip = (pageNumber - 1) * limitNumber;

    // --------------------------------------------------
    // 4. Fetch cases + total count
    // --------------------------------------------------

    const [cases, total] = await Promise.all([
      Case.find(filter)
        .populate("category", "name description caseType parent")
        .populate("subcategory", "name description caseType parent")
        .populate("createdBy", "name email role")
        .populate("assignedTo", "name email role")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNumber),

      Case.countDocuments(filter),
    ]);

    // --------------------------------------------------
    // 5. Pagination information
    // --------------------------------------------------

    const totalPages = Math.ceil(total / limitNumber);

    // --------------------------------------------------
    // 6. Response
    // --------------------------------------------------

    return res.status(200).json({
      success: true,
      count: cases.length,
      data: cases,
      pagination: {
        page: pageNumber,
        limit: limitNumber,
        total,
        pages: totalPages,
        hasNextPage: pageNumber < totalPages,
        hasPreviousPage: pageNumber > 1,
      },
    });
  } catch (error) {
    console.error("Get all cases error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch cases",
    });
  }
};

// ============================================================
// GET ACTIVE STAFF
// GET /api/cases/staff
// ADMIN ONLY
// ============================================================

export const getActiveStaff = async (req, res) => {
  try {
    const staff = await User.find({
      role: "STAFF",
      isActive: true,
    })
      .select("_id name email role")
      .sort({ name: 1 });

    return res.status(200).json({
      success: true,
      count: staff.length,
      data: staff,
    });
  } catch (error) {
    console.error("Get active staff error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch staff",
    });
  }
};

// ============================================================
// ASSIGN CASE TO STAFF
// PUT /api/cases/:id/assign
// ADMIN ONLY
// ============================================================

export const assignCase = async (req, res) => {
  try {
    const { id } = req.params;
    const { staffId } = req.body;

    // --------------------------------------------------
    // 1. Validate staffId
    // --------------------------------------------------

    if (!staffId) {
      return res.status(400).json({
        success: false,
        message: "Staff ID is required",
      });
    }

    // --------------------------------------------------
    // 2. Find case
    // --------------------------------------------------

    const caseData = await Case.findById(id);

    if (!caseData) {
      return res.status(404).json({
        success: false,
        message: "Case not found",
      });
    }

    // --------------------------------------------------
    // 3. Find active staff
    // --------------------------------------------------

    const staff = await User.findOne({
      _id: staffId,
      role: "STAFF",
      isActive: true,
    });

    if (!staff) {
      return res.status(404).json({
        success: false,
        message: "Active staff member not found",
      });
    }

    // --------------------------------------------------
    // 4. Store previous values
    // --------------------------------------------------

    const previousStatus = caseData.status;
    const previousAssignedTo = caseData.assignedTo;

    // --------------------------------------------------
    // 5. Assign staff
    // --------------------------------------------------

    caseData.assignedTo = staff._id;
    caseData.status = "ASSIGNED";

    await caseData.save();

    // --------------------------------------------------
    // 6. Create audit log
    // --------------------------------------------------

    await createAuditLog({
      case: caseData._id,
      performedBy: req.user._id,
      action: "ASSIGNED",
      previousStatus,
      newStatus: "ASSIGNED",
      details: previousAssignedTo
        ? `Case reassigned to ${staff.name}`
        : `Case assigned to ${staff.name}`,
    });

    // --------------------------------------------------
    // 7. Populate response
    // --------------------------------------------------

    const populatedCase = await Case.findById(caseData._id)
      .populate("category", "name description caseType parent")
      .populate("subcategory", "name description caseType parent")
      .populate("createdBy", "name email role")
      .populate("assignedTo", "name email role");

    return res.status(200).json({
      success: true,
      message: previousAssignedTo
        ? "Case reassigned successfully"
        : "Case assigned successfully",
      data: populatedCase,
    });
  } catch (error) {
    console.error("Assign case error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to assign case",
    });
  }
};

// ============================================================
// CLOSE CASE - STUDENT
// PUT /api/cases/:id/close
// STUDENT ONLY
// ============================================================

export const closeCase = async (req, res) => {
  try {
    const { id } = req.params;

    // --------------------------------------------------
    // 1. Find case
    // --------------------------------------------------

    const caseData = await Case.findById(id);

    if (!caseData) {
      return res.status(404).json({
        success: false,
        message: "Case not found",
      });
    }

    // --------------------------------------------------
    // 2. Verify case owner
    // --------------------------------------------------

    if (
      caseData.createdBy.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "You can only close your own cases",
      });
    }

    // --------------------------------------------------
    // 3. Case must be RESOLVED
    // --------------------------------------------------

    if (caseData.status !== "RESOLVED") {
      return res.status(400).json({
        success: false,
        message: `Case cannot be closed from ${caseData.status} status`,
      });
    }

    // --------------------------------------------------
    // 4. Store previous status
    // --------------------------------------------------

    const previousStatus = caseData.status;

    // --------------------------------------------------
    // 5. Close case
    // --------------------------------------------------

    caseData.status = "CLOSED";
    caseData.closedAt = new Date();

    await caseData.save();

    // --------------------------------------------------
    // 6. Audit log
    // --------------------------------------------------

    await createAuditLog({
      case: caseData._id,
      performedBy: req.user._id,
      action: "CLOSED",
      previousStatus,
      newStatus: "CLOSED",
      details: `Case ${caseData.caseId} closed by case owner`,
    });

    // --------------------------------------------------
    // 7. Return populated case
    // --------------------------------------------------

    const populatedCase = await Case.findById(caseData._id)
      .populate("category", "name description caseType parent")
      .populate("subcategory", "name description caseType parent")
      .populate("createdBy", "name email role")
      .populate("assignedTo", "name email role");

    return res.status(200).json({
      success: true,
      message: "Case closed successfully",
      data: populatedCase,
    });
  } catch (error) {
    console.error("Close case error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to close case",
    });
  }
};


// ============================================================
// REOPEN CASE - STUDENT
// PUT /api/cases/:id/reopen
// STUDENT ONLY
// ============================================================

export const reopenCase = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    // --------------------------------------------------
    // 1. Validate reason
    // --------------------------------------------------

    if (!reason || !reason.trim()) {
      return res.status(400).json({
        success: false,
        message: "Reopen reason is required",
      });
    }

    if (reason.trim().length < 10) {
      return res.status(400).json({
        success: false,
        message: "Reopen reason must be at least 10 characters",
      });
    }

    // --------------------------------------------------
    // 2. Find case
    // --------------------------------------------------

    const caseData = await Case.findById(id);

    if (!caseData) {
      return res.status(404).json({
        success: false,
        message: "Case not found",
      });
    }

    // --------------------------------------------------
    // 3. Verify case owner
    // --------------------------------------------------

    if (
      caseData.createdBy.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "You can only reopen your own cases",
      });
    }

    // --------------------------------------------------
    // 4. Case must be RESOLVED
    // --------------------------------------------------

    if (caseData.status !== "RESOLVED") {
      return res.status(400).json({
        success: false,
        message: `Case cannot be reopened from ${caseData.status} status`,
      });
    }

    // --------------------------------------------------
    // 5. Store previous status
    // --------------------------------------------------

    const previousStatus = caseData.status;

    // --------------------------------------------------
    // 6. Reopen case
    // --------------------------------------------------

    caseData.status = "REOPENED";

    caseData.resolution.reopenReason = reason.trim();

    caseData.reopenedAt = new Date();

    await caseData.save();

    // --------------------------------------------------
    // 7. Audit log
    // --------------------------------------------------

    await createAuditLog({
      case: caseData._id,
      performedBy: req.user._id,
      action: "REOPENED",
      previousStatus,
      newStatus: "REOPENED",
      details: `Case ${caseData.caseId} reopened. Reason: ${reason.trim()}`,
    });

    // --------------------------------------------------
    // 8. Return populated case
    // --------------------------------------------------

    const populatedCase = await Case.findById(caseData._id)
      .populate("category", "name description caseType parent")
      .populate("subcategory", "name description caseType parent")
      .populate("createdBy", "name email role")
      .populate("assignedTo", "name email role");

    return res.status(200).json({
      success: true,
      message: "Case reopened successfully",
      data: populatedCase,
    });
  } catch (error) {
    console.error("Reopen case error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to reopen case",
    });
  }
};