import api from "../api";

export const fetchAdminProfile = async () => {
  return api.get("/users/profile");
};

export const fetchAllUsers = async () => {
  return api.get("/users");
};

export const fetchUserTotalSpent = async (userId) => {
  return api.get(`/users/total-spent/${userId}`);
};

export const fetchUserStatusCounts = async () => {
  return api.get("/users/status-counts");
};
