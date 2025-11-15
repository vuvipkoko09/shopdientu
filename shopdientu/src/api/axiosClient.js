import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: { "Content-Type": "application/json" },
});
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
axiosClient.interceptors.response.use(
  (response) => response.data, 
  (error) => {
    console.error("API error:", error);

    if (error.response && error.response.status === 401) {
      alert("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại.");
      localStorage.removeItem("token");
      localStorage.removeItem("expiryTime");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
