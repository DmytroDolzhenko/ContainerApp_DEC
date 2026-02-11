import axiosClient from "../../../api/axiosClient";

export const authApi = {
  login: async (credentials) => {
    const response = await axiosClient.post("/auth/login", credentials);
    return response.data;
  }
};