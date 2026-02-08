import axiosClient from "../../../api/axiosClient";

export const userApi = {
  getAll: async () => {
    const response = await axiosClient.get("/users");
    return response.data;
  },

};