import api from "./axios";

export const getAdminComplaints = async () => {
  const response = await api.get("/complaints");
  return response.data;
};

export const getStaffUsers = async () => {
  const response = await api.get("/users/staff");
  return response.data;
};

export const getAllUsers = async () => {
  const response = await api.get("/users");
  return response.data;
};

export const toggleUserStatus = async (userId) => {
  const response = await api.patch(
    `/users/${userId}/status`
  );

  return response.data;
};

export const getAdminCategories = async () => {
  const response = await api.get(
    "/categories/admin"
  );

  return response.data;
};

export const createCategory = async (categoryData) => {
  const response = await api.post(
    "/categories",
    categoryData
  );

  return response.data;
};

export const updateCategory = async (
  categoryId,
  categoryData
) => {
  const response = await api.patch(
    `/categories/${categoryId}`,
    categoryData
  );

  return response.data;
};

export const toggleCategoryStatus = async (
  categoryId
) => {
  const response = await api.patch(
    `/categories/${categoryId}/status`
  );

  return response.data;
};

export const getAuditLogs = async () => {
  const response = await api.get("/audit-logs");
  return response.data;
};