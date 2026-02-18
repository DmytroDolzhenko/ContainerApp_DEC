import axiosClient from "../../../api/axiosClient";

export const containerHistoryApi = {
  getContainerHistory: async (id) => {
    const response = await axiosClient.get(`/containers/${id}/history`);
    return response.data;
  },

  getLatestContainerHistory: async (id) => {
    const response = await axiosClient.get(`/containers/${id}/history/latest`);
    return response.data;
  },
};