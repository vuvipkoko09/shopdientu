import axiosClient from "./axiosClient";

const CategoryService = {
  getAll: () => axiosClient.get("/categories"),
  create: (data) => axiosClient.post("/categories", data),
  update: (id, data) => axiosClient.put(`/categories/${id}`, data),
  delete: (id) => axiosClient.delete(`/categories/${id}`),
  getOne: (id) => axiosClient.get(`categories/${id}`),
};

export default CategoryService;
