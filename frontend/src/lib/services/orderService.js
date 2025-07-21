import api from "../api.js";

export const orderService = {
  // Get user's orders
  getUserOrders: async () => {
    try {
      const response = await api.get("/orders/user/my-orders");
      return response;
    } catch (error) {
      console.error("Error fetching user orders:", error);
      throw error;
    }
  },

  // Get order by ID
  getOrderById: async (orderId) => {
    try {
      const response = await api.get(`/orders/user/${orderId}`);
      return response;
    } catch (error) {
      console.error("Error fetching order by ID:", error);
      throw error;
    }
  },

  // Create new order
  createOrder: async (orderData) => {
    try {
      const response = await api.post("/orders/create", orderData);
      // The api interceptor already returns response.data, so response is the actual data
      return response;
    } catch (error) {
      console.error("Error creating order:", error);
      // The error is already processed by the response interceptor
      return {
        success: false,
        message: error.message || "Failed to create order",
        error: error,
      };
    }
  },

  // Verify payment
  verifyPayment: async (reference) => {
    try {
      const response = await api.get(`/orders/verify/${reference}`);
      return response;
    } catch (error) {
      console.error("Error verifying payment:", error);
      throw error;
    }
  },

  // Admin payment verification
  adminVerifyPayment: async (orderId, reference) => {
    try {
      const response = await api.post(
        `/orders/admin/${orderId}/verify-payment`,
        {
          reference: reference,
        }
      );
      return response;
    } catch (error) {
      console.error("Error verifying payment (admin):", error);
      throw error;
    }
  },
};
