import axiosClient from "../../../api/axiosClient";

export const productTypeApi = {
  getAll: async () => {
    const response = await axiosClient.get("/product-types");
    return response.data;
  }
};