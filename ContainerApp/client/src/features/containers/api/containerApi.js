import axiosClient from "../../../api/axiosClient";

export const containerApi = {
  getAll: async () => {
    const response = await axiosClient.get("/containers");
    return response.data;
  },

  getById: async (id) => {
    const response = await axiosClient.get(`/containers/${id}`);
    return response.data;
  },

  create: async (newContainer) => {
    const response = await axiosClient.post("/containers" , newContainer);
    return response.data;
  },

  update: async (id, updatedData) => {
    const response = await axiosClient.put(`/containers/${id}`, updatedData);
    return response.data;
  },

  delete: async (id) => {
    const response = await axiosClient.delete(`/containers/${id}`);
    return response.data;
  },

  fill: async (id, updatedData) => {
    const response = await axiosClient.put(`/containers/${id}/fill`, updatedData);
    return response.data;
  },

  getExpiring: async () => {
  const response = await axiosClient.get("/containers/expirationDate");
  return response.data;
  },

  clean: async (id, updatedData) => {
    const response = await axiosClient.put(`/containers/${id}/clean`, updatedData);
    return response.data;
  },

  getQr: async (uniqCode) => {
    const response = await axiosClient.get(`/containers/${uniqCode}/qr`);
    return response.data;
  }
};