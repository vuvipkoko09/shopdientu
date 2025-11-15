import axios from "axios";

const API_URL = "http://localhost:8080/api/auth";

const login = async (username, password) => {
  const response = await axios.post(API_URL + "/login", {
    username,
    password,
  });
  if (response.data.token) {
    localStorage.setItem("token", response.data.token);
    localStorage.setItem("role", response.data.role);
    localStorage.setItem("name", response.data.name);
  }

  return response.data;
};
const register = async (formData) => {
  const response = await axios.post(API_URL + "/register", {
    username: formData.username,
    email: formData.email,
    password: formData.password,
    name: formData.name,
    address: formData.address,
    phoneNumber: formData.phoneNumber,
  });

  if (response.data.token) {
    localStorage.setItem("token", response.data.token);
    localStorage.setItem("role", response.data.role);
  }

  return response.data;
};
const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
};

const getCurrentUser = () => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const name = localStorage.getItem("name");
  if (token) {
    return { token, role, name };
  } else {
    return null;
  }
};

const AuthService = {
  login,
  logout,
  getCurrentUser,
  register,
};

export default AuthService;
