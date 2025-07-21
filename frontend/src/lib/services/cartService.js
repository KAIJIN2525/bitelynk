import api from "../api.js";

export const cartService = {
  // Get user's cart
  getCart: async () => {
    const response = await api.get("/cart");
    return response;
  },

  // Add item to cart
  addToCart: async (productId, quantity = 1) => {
    const response = await api.post("/cart/add", { productId, quantity });
    return response;
  },

  // Update item quantity in cart
  updateCartItem: async (productId, quantity) => {
    const response = await api.put("/cart/update", { productId, quantity });
    return response;
  },

  // Remove item from cart
  removeFromCart: async (productId) => {
    const response = await api.delete(`/cart/remove/${productId}`);
    return response;
  },

  // Clear entire cart
  clearCart: async () => {
    const response = await api.delete("/cart/clear");
    return response;
  },
};
