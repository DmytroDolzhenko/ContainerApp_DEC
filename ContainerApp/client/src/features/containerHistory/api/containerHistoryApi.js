import axiosClient from "../../../api/axiosClient";

export const containerHistoryApi = {
  getContainerHistory: async () => {
    const response = await axiosClient.get("/containers/8/history");
    return response.data;
  },

};