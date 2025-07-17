import api from "../api";

export const productService = {
  createProduct: async (productData) => {
    return await api.post("/products", productData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  getAllProducts: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return await api.get(`/products?${queryString}`);
  },

  getProduct: async (id) => {
    return await api.get(`/products/${id}`);
  },
  updateProduct: async (id, productData) => {
    return await api.put(`/products/${id}`, productData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  deleteProduct: async (id) => {
    return await api.delete(`/products/${id}`);
  },
};
