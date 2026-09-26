import createAuditLog from "../utils/createAuditLog.js";
import createNotification from "../utils/createNotification.js";
import Complaint from "../models/Complaint.js";
import Category from "../models/Category.js";
import User from "../models/User.js";


// ============================================================
// CREATE COMPLAINT
// ============================================================

export const createComplaint = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      priority,
      location,
      isAnonymous,
    } = req.body;

    // 1. Validate required fields
    if (!title || !description || !category || !location) {
      return res.status(400).json({
        success: false,
        message:
          "Title, description, category and location are required",
      });
    }

    // 2. Verify category exists and is active
    const categoryExists = await Category.findOne({
      _id: category,
      isActive: true,
    });

    if (!categoryExists) {
      return res.status(400).json({
        success: false,
        message: "Invalid or inactive complaint category",
      });
    }

    // 3. Generate complaint ID
    const complaintId = `UNI-${Date.now()}`;

    // 4. Create complaint
    const complaint = await Complaint.create({
      complaintId,
      title,
      description,
      category,
      priority: priority || "MEDIUM",
      location,
      createdBy: req.user._id,
      isAnonymous: Boolean(isAnonymous),
      status: "PENDING",
    });

    // 5. Create audit log
    await createAuditLog({
      complaint: complaint._id,
      performedBy: req.user._id,
      action: "CREATED",
      previousStatus: null,
      newStatus: "PENDING",
      details: "Complaint created by student",
    });

    // 6. Return created complaint
    return res.status(201).json({
      success: true,
      message: "Complaint created successfully",
      complaint: {
        id: complaint._id,
        complaintId: complaint.complaintId,
        title: complaint.title,
        description: complaint.description,
        category: complaint.category,
        priority: complaint.priority,
        status: complaint.status,
        location: complaint.location,
        isAnonymous: complaint.isAnonymous,
        createdAt: complaint.createdAt,
      },
    });
  } catch (error) {
    console.error("Create complaint error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


// ============================================================
// GET MY COMPLAINTS
// ============================================================

export const getMyComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({
      createdBy: req.user._id,
    })
      .populate("category", "name")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: complaints.length,
      complaints,
    });
  } catch (error) {
    console.error("Get my complaints error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


// ============================================================
// GET COMPLAINT BY ID
// ============================================================

export const getComplaintById = async (req, res) => {
  try {
    const { id } = req.params;

    const complaint = await Complaint.findById(id)
      .populate("category", "name description")
      .populate("createdBy", "name email")
      .populate("assignedTo", "name email");

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found",
      });
    }

    // Student can only access their own complaint
    if (
      complaint.createdBy._id.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message:
          "You do not have permission to view this complaint",
      });
    }

    return res.status(200).json({
      success: true,
      complaint,
    });
  } catch (error) {
    console.error("Get complaint error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


// ============================================================
// GET ALL COMPLAINTS - ADMIN
// ============================================================

export const getAllComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find()
      .populate("category", "name")
      .populate("createdBy", "name email")
      .populate("assignedTo", "name email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: complaints.length,
      complaints,
    });
  } catch (error) {
    console.error("Get all complaints error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


// ============================================================
// ASSIGN COMPLAINT - ADMIN
// ============================================================

export const assignComplaint = async (req, res) => {
  try {
    const { id } = req.params;
    const { staffId } = req.body;

    // 1. Validate staff ID
    if (!staffId) {
      return res.status(400).json({
        success: false,
        message: "Staff ID is required",
      });
    }

    // 2. Find complaint
    const complaint = await Complaint.findById(id);

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found",
      });
    }

    // 3. Verify staff user
    const staff = await User.findOne({
      _id: staffId,
      role: "STAFF",
      isActive: true,
    });

    if (!staff) {
      return res.status(400).json({
        success: false,
        message: "Invalid or inactive staff member",
      });
    }

    // 4. Store previous status
    const previousStatus = complaint.status;

    // 5. Assign complaint
    complaint.assignedTo = staff._id;
    complaint.status = "ASSIGNED";

    await complaint.save();

    // 6. Audit log
    await createAuditLog({
      complaint: complaint._id,
      performedBy: req.user._id,
      action: "ASSIGNED",
      previousStatus,
      newStatus: "ASSIGNED",
      details: `Complaint assigned to staff member ${staff.name}`,
    });

    // 7. Notify staff
    await createNotification({
      recipient: staff._id,
      complaint: complaint._id,
      type: "COMPLAINT_ASSIGNED",
      title: "New Complaint Assigned",
      message: `Complaint ${complaint.complaintId} has been assigned to you.`,
    });

    return res.status(200).json({
      success: true,
      message: "Complaint assigned successfully",
      complaint: {
        id: complaint._id,
        complaintId: complaint.complaintId,
        assignedTo: complaint.assignedTo,
        status: complaint.status,
      },
    });
  } catch (error) {
    console.error("Assign complaint error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


// ============================================================
// GET ASSIGNED COMPLAINTS - STAFF
// ============================================================

export const getAssignedComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({
      assignedTo: req.user._id,
    })
      .populate("category", "name")
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: complaints.length,
      complaints,
    });
  } catch (error) {
    console.error("Get assigned complaints error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


// ============================================================
// START COMPLAINT - STAFF
// ASSIGNED / REOPENED → IN_PROGRESS
// ============================================================

export const startComplaint = async (req, res) => {
  try {
    const { id } = req.params;

    const complaint = await Complaint.findById(id);

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found",
      });
    }

    // Verify assigned staff
    if (
      !complaint.assignedTo ||
      complaint.assignedTo.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "This complaint is not assigned to you",
      });
    }

    // Only ASSIGNED or REOPENED complaints can be started
    if (!["ASSIGNED", "REOPENED"].includes(complaint.status)) {
      return res.status(400).json({
        success: false,
        message:
          "Only assigned or reopened complaints can be started",
      });
    }

    // IMPORTANT:
    // Store previous status BEFORE changing it
    const previousStatus = complaint.status;

    complaint.status = "IN_PROGRESS";

    await complaint.save();

    // Audit log
    await createAuditLog({
      complaint: complaint._id,
      performedBy: req.user._id,
      action: "STARTED",
      previousStatus,
      newStatus: "IN_PROGRESS",
      details: "Staff started working on the complaint",
    });

    // Notify student
    await createNotification({
      recipient: complaint.createdBy,
      complaint: complaint._id,
      type: "COMPLAINT_STARTED",
      title: "Complaint Work Started",
      message: `Work has started on complaint ${complaint.complaintId}.`,
    });

    return res.status(200).json({
      success: true,
      message: "Complaint moved to in-progress",
      complaint: {
        id: complaint._id,
        complaintId: complaint.complaintId,
        status: complaint.status,
        assignedTo: complaint.assignedTo,
      },
    });
  } catch (error) {
    console.error("Start complaint error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


// ============================================================
// RESOLVE COMPLAINT - STAFF
// IN_PROGRESS → RESOLVED
// ============================================================

export const resolveComplaint = async (req, res) => {
  try {
    const { id } = req.params;
    const { notes } = req.body;

    // 1. Resolution notes required
    if (!notes || !notes.trim()) {
      return res.status(400).json({
        success: false,
        message: "Resolution notes are required",
      });
    }

    // 2. Find complaint
    const complaint = await Complaint.findById(id);

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found",
      });
    }

    // 3. Verify assigned staff
    if (
      !complaint.assignedTo ||
      complaint.assignedTo.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "This complaint is not assigned to you",
      });
    }

    // 4. Only IN_PROGRESS complaints can be resolved
    if (complaint.status !== "IN_PROGRESS") {
      return res.status(400).json({
        success: false,
        message: "Only in-progress complaints can be resolved",
      });
    }

    // 5. Store previous status
    const previousStatus = complaint.status;

    // 6. Store resolution
    complaint.resolution.notes = notes.trim();
    complaint.status = "RESOLVED";
    complaint.resolvedAt = new Date();

    await complaint.save();

    // 7. Audit log
    await createAuditLog({
      complaint: complaint._id,
      performedBy: req.user._id,
      action: "RESOLVED",
      previousStatus,
      newStatus: "RESOLVED",
      details: "Staff resolved the complaint",
    });

    // 8. Notify student
    await createNotification({
      recipient: complaint.createdBy,
      complaint: complaint._id,
      type: "COMPLAINT_RESOLVED",
      title: "Complaint Resolved",
      message: `Complaint ${complaint.complaintId} has been marked as resolved. Please review the resolution.`,
    });

    return res.status(200).json({
      success: true,
      message: "Complaint resolved successfully",
      complaint: {
        id: complaint._id,
        complaintId: complaint.complaintId,
        status: complaint.status,
        resolution: complaint.resolution,
        resolvedAt: complaint.resolvedAt,
      },
    });
  } catch (error) {
    console.error("Resolve complaint error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


// ============================================================
// CLOSE COMPLAINT - STUDENT
// RESOLVED → CLOSED
// ============================================================

export const closeComplaint = async (req, res) => {
  try {
    const { id } = req.params;

    const complaint = await Complaint.findById(id);

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found",
      });
    }

    // Only complaint owner can close it
    if (
      complaint.createdBy.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message:
          "You do not have permission to close this complaint",
      });
    }

    // Only RESOLVED complaints can be closed
    if (complaint.status !== "RESOLVED") {
      return res.status(400).json({
        success: false,
        message: "Only resolved complaints can be closed",
      });
    }

    const previousStatus = complaint.status;

    complaint.status = "CLOSED";
    complaint.closedAt = new Date();

    await complaint.save();

    // Audit log
    await createAuditLog({
      complaint: complaint._id,
      performedBy: req.user._id,
      action: "CLOSED",
      previousStatus,
      newStatus: "CLOSED",
      details:
        "Student accepted the resolution and closed the complaint",
    });

    // Notify assigned staff
    if (complaint.assignedTo) {
      await createNotification({
        recipient: complaint.assignedTo,
        complaint: complaint._id,
        type: "COMPLAINT_CLOSED",
        title: "Complaint Closed",
        message: `Complaint ${complaint.complaintId} has been closed by the student.`,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Complaint closed successfully",
      complaint: {
        id: complaint._id,
        complaintId: complaint.complaintId,
        status: complaint.status,
        closedAt: complaint.closedAt,
      },
    });
  } catch (error) {
    console.error("Close complaint error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


// ============================================================
// REOPEN COMPLAINT - STUDENT
// RESOLVED → REOPENED
// ============================================================

export const reopenComplaint = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    // 1. Reopen reason required
    if (!reason || !reason.trim()) {
      return res.status(400).json({
        success: false,
        message: "Reopen reason is required",
      });
    }

    // 2. Find complaint
    const complaint = await Complaint.findById(id);

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found",
      });
    }

    // 3. Only complaint owner can reopen it
    if (
      complaint.createdBy.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message:
          "You do not have permission to reopen this complaint",
      });
    }

    // 4. Only RESOLVED complaints can be reopened
    if (complaint.status !== "RESOLVED") {
      return res.status(400).json({
        success: false,
        message: "Only resolved complaints can be reopened",
      });
    }

    const previousStatus = complaint.status;

    complaint.status = "REOPENED";

    if (!complaint.resolution) {
      complaint.resolution = {};
    }

    complaint.resolution.reopenReason = reason.trim();

    await complaint.save();

    // Audit log
    await createAuditLog({
      complaint: complaint._id,
      performedBy: req.user._id,
      action: "REOPENED",
      previousStatus,
      newStatus: "REOPENED",
      details: `Student reopened the complaint: ${reason.trim()}`,
    });

    // Notify assigned staff
    if (complaint.assignedTo) {
      await createNotification({
        recipient: complaint.assignedTo,
        complaint: complaint._id,
        type: "COMPLAINT_REOPENED",
        title: "Complaint Reopened",
        message: `Complaint ${complaint.complaintId} has been reopened by the student.`,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Complaint reopened successfully",
      complaint: {
        id: complaint._id,
        complaintId: complaint.complaintId,
        status: complaint.status,
        reopenReason: complaint.resolution.reopenReason,
      },
    });
  } catch (error) {
    console.error("Reopen complaint error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};