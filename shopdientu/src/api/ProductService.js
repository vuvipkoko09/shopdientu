import axiosClient from "./axiosClient";

const ProductService = {
  // Lấy tất cả sản phẩm
  getAllProducts: () => axiosClient.get("/products"),

  // Lấy sản phẩm theo ID
  getProductById: (id) => axiosClient.get(`/products/${id}`),

  // Thêm sản phẩm mới
  createProduct: (data) => axiosClient.post("/products", data),

  // Cập nhật sản phẩm
  updateProduct: (id, data) => axiosClient.put(`/products/${id}`, data),

  // Xóa sản phẩm
  deleteProduct: (id) => axiosClient.delete(`/products/${id}`),

  // Tìm sản phẩm theo tên
  searchByName: (name) => axiosClient.get(`/products/search?name=${name}`),

  // Lọc sản phẩm theo khoảng giá
  filterByPrice: (min, max) =>
    axiosClient.get(`/products/price?min=${min}&max=${max}`),

  // Tìm theo danh mục
  getByCategory: (categoryId) =>
    axiosClient.get(`/products/category/${categoryId}`),
  uploadImage: (file, type) => {
    // <-- Thêm 'type'
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", type); // <-- Thêm 'type' vào FormData

    return axiosClient.post("/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
};

export default ProductService;
