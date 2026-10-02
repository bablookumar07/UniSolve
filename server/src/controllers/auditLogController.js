import AuditLog from "../models/AuditLog.js";

/*
|--------------------------------------------------------------------------
| Get All Audit Logs
|--------------------------------------------------------------------------
| Admin only.
*/

export const getAllAuditLogs = async (req, res) => {
  try {
    const auditLogs = await AuditLog.find()
      .populate(
        "performedBy",
        "name email role"
      )
      .populate(
        "complaint",
        "complaintId title status"
      )
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: auditLogs.length,
      auditLogs,
    });
  } catch (error) {
    console.error(
      "Get all audit logs error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};