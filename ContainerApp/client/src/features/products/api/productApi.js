import axiosClient from "../../../api/axiosClient";

export const productApi = {
  getAll: async () => {
    const response = await axiosClient.get("/products");
    return response.data;
  },

};