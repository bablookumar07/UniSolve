import AuditLog from "../models/AuditLog.js";

const createAuditLog = async ({
  complaint,
  performedBy,
  action,
  previousStatus = null,
  newStatus = null,
  details = null,
}) => {
  try {
    await AuditLog.create({
      complaint,
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