import axiosClient from "../../../api/axiosClient";

export const productApi = {
  getAll: async () => {
    const response = await axiosClient.get("/products");
    return response.data;
  },

  getById: async (id) => {
    const response = await axiosClient.get(`/products/${id}`);
    return response.data;
  },

  create: async (newProduct) => {
    const response = await axiosClient.post("/products" , newProduct);
    return response.data;
  },

  update: async (id, updatedData) => {
    const response = await axiosClient.put(`/products/${id}`, updatedData);
    return response.data;
  },

  delete: async (id) => {
    const response = await axiosClient.delete(`/products/${id}`);
    return response.data;
  }
};