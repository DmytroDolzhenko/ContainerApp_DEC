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
  },

  createCompliance: async (data) => {
    const response = await axiosClient.post(`/product-container-compliance`, data);
    return response.data;
  },
  deleteCompliance: async (productTypeId, containerTypeId) => {
    const response = await axiosClient.delete(`/product-container-compliance`, {
      params: { productTypeId, containerTypeId }
    });
    return response.data;
  },

  getTypes: async () => {
    const response = await axiosClient.get("/product-types");
    return response.data;
  },

  createType: async (name) => {
    const response = await axiosClient.post("/product-types", { name });
    return response.data;
  },

  getCompliances: async () => {
    const response = await axiosClient.get("/product-container-compliance");
    return response.data;
},

  deleteType: async (id) => {
    const response = await axiosClient.delete(`/product-types/${id}`);
    return response.data;
  }
};