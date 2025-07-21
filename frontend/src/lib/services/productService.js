import api from "../api.js";

export const productService = {
  // Get all products
  getAllProducts: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `/products?${queryString}` : "/products";
    return await api.get(url);
  },

  // Get product by ID
  getProductById: async (id) => {
    return await api.get(`/products/${id}`);
  },

  // Get products by category
  getProductsByCategory: async (category) => {
    return await api.get(`/products?category=${encodeURIComponent(category)}`);
  },

  // Search products
  searchProducts: async (searchTerm) => {
    return await api.get(`/products?search=${encodeURIComponent(searchTerm)}`);
  },
};
