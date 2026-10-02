import api from "./axios";

// ============================================================
// STUDENT COMPLAINT APIs
// ============================================================

export const getMyComplaints = async () => {
  const response = await api.get("/complaints/my");

  return response.data;
};

export const getComplaintById = async (complaintId) => {
  const response = await api.get(`/complaints/${complaintId}`);

  return response.data;
};

export const createComplaint = async (complaintData) => {
  const response = await api.post(
    "/complaints",
    complaintData
  );

  return response.data;
};

export const uploadComplaintEvidence = async (
  complaintId,
  file
) => {
  const formData = new FormData();

  formData.append("evidence", file);

  const response = await api.post(
    `/complaints/${complaintId}/evidence`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};

export const closeComplaint = async (complaintId) => {
  const response = await api.patch(
    `/complaints/${complaintId}/close`
  );

  return response.data;
};

export const reopenComplaint = async (
  complaintId,
  reason
) => {
  const response = await api.patch(
    `/complaints/${complaintId}/reopen`,
    {
      reason,
    }
  );

  return response.data;
};

export const getAssignedComplaints = async () => {
  const response = await api.get("/complaints/assigned");
  return response.data;
};

export const startComplaint = async (complaintId) => {
  const response = await api.patch(`/complaints/${complaintId}/start`);
  return response.data;
};

export const resolveComplaint = async (complaintId, notes) => {
  const response = await api.patch(
    `/complaints/${complaintId}/resolve`,
    { notes }
  );

  return response.data;
};

export const uploadResolutionEvidence = async (complaintId, file) => {
  const formData = new FormData();

  formData.append("evidence", file);

  const response = await api.post(
    `/complaints/${complaintId}/resolution-evidence`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};

export const assignComplaint = async (complaintId, staffId) => {
  const response = await api.patch(
    `/complaints/${complaintId}/assign`,
    {
      staffId,
    }
  );

  return response.data;
};