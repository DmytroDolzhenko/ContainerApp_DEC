import axiosClient from "../../../api/axiosClient";

export const containerApi = {
  getAll: async () => {
    const response = await axiosClient.get("/containers");
    return response.data;
  },

};