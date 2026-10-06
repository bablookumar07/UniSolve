import AuditLog from "../models/AuditLog.js";

const createAuditLog = async ({
  complaint = null,
  case: caseId = null,
  performedBy,
  action,
  previousStatus = null,
  newStatus = null,
  details = null,
}) => {
  try {
    await AuditLog.create({
      complaint,
      case: caseId,
      performedBy,
      action,
      previousStatus,
      newStatus,
      details,
    });
  } catch (error) {
    console.error("Audit log error:", error);
  }
};

export default createAuditLog;