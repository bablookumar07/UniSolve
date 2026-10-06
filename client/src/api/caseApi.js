import api from "./axios";


export const getCaseCategories = async (caseType) => {
  const response = await api.get("/categories", {
    params: {
      caseType,
    },
  });

  return response.data;
};

// ============================================================
// CREATE CASE
// ============================================================

export const createCase = async (caseData) => {
  const response = await api.post("/cases", caseData);
  return response.data;
};


// ============================================================
// GET MY CASES - STUDENT
// ============================================================

export const getMyCases = async () => {
  const response = await api.get("/cases/my");
  return response.data;
};


// ============================================================
// GET CASE BY ID
// ============================================================

export const getCaseById = async (caseId) => {
  const response = await api.get(`/cases/${caseId}`);
  return response.data;
};


// ============================================================
// GET ALL CASES - ADMIN
// ============================================================

export const getAllCases = async (params = {}) => {
  const response = await api.get("/cases", {
    params,
  });

  return response.data;
};


// ============================================================
// GET ACTIVE STAFF - ADMIN
// ============================================================

export const getActiveStaff = async () => {
  const response = await api.get("/cases/staff");
  return response.data;
};


// ============================================================
// ASSIGN CASE - ADMIN
// ============================================================

export const assignCase = async (caseId, staffId) => {
  const response = await api.put(
    `/cases/${caseId}/assign`,
    { staffId }
  );

  return response.data;
};


// ============================================================
// GET ASSIGNED CASES - STAFF
// ============================================================

export const getAssignedCases = async () => {
  const response = await api.get("/cases/assigned");
  return response.data;
};


// ============================================================
// START CASE - STAFF
// ============================================================

export const startCase = async (caseId) => {
  const response = await api.put(
    `/cases/${caseId}/start`
  );

  return response.data;
};


// ============================================================
// RESOLVE CASE - STAFF
// ============================================================

export const resolveCase = async (caseId, notes) => {
  const response = await api.put(
    `/cases/${caseId}/resolve`,
    { notes }
  );

  return response.data;
};


// ============================================================
// CLOSE CASE - STUDENT
// ============================================================

export const closeCase = async (caseId) => {
  const response = await api.put(
    `/cases/${caseId}/close`
  );

  return response.data;
};


// ============================================================
// REOPEN CASE - STUDENT
// ============================================================

export const reopenCase = async (caseId, reason) => {
  const response = await api.put(
    `/cases/${caseId}/reopen`,
    { reason }
  );

  return response.data;
};