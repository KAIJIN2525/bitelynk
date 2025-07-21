import api from "../api";

export const userService = {
  // Get current user profile
  getProfile: async () => {
    return await api.get("/users/profile");
  },

  // Alias for getProfile (for backward compatibility)
  getUserProfile: async () => {
    return await api.get("/users/profile");
  },

  // Update user profile
  updateProfile: async (userData) => {
    return await api.put("/users/profile", userData);
  },

  // Get user's orders
  getUserOrders: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return await api.get(`/orders/user/my-orders?${queryString}`);
  },
};
