import axiosClient from "../../../api/axiosClient";

export const userApi = {
  getAll: async () => {
    const response = await axiosClient.get("/users");
    return response.data;
  },

  getById: async (id) => {
    const response = await axiosClient.get(`/users/${id}`);
    return response.data;
  },

  create: async (newUser) => {
    const response = await axiosClient.post("/users" , newUser);
    return response.data;
  },

  update: async (id, updatedData) => {
    const response = await axiosClient.put(`/users/${id}`, updatedData);
    return response.data;
  },

  changeRole: async (id, data) => {
    return await axiosClient.patch(`/users/${id}/role`, data);
  },

  delete: async (id) => {
    const response = await axiosClient.delete(`/users/${id}`);
    return response.data;
  }
};