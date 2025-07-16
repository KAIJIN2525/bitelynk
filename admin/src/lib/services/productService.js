import api from "../api";

export const productService = {
  createProduct: async (productData) => {
    return await api.post("/products", productData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
};
