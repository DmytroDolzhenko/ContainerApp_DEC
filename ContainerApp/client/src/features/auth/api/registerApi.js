import axiosClient from "../../../api/axiosClient";

export const authApi = {
  register: async (credentials) => {
    const response = await axiosClient.post("/Auth/register", credentials);
    return response.data;
  }
};