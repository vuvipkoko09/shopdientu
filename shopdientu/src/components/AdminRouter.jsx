import React from "react";
import { Navigate } from "react-router-dom";
import AuthService from "../api/AuthService";

const AdminRoute = ({ children }) => {
  const currentUser = AuthService.getCurrentUser();

  if (!currentUser) {
    // Nếu chưa login -> chuyển về login
    return <Navigate to="/login" replace />;
  }

  if (currentUser.role !== "ADMIN" && currentUser.role !== "ROLE_ADMIN") {
    // Nếu không phải admin -> chuyển về trang chủ hoặc thông báo
    alert("Bạn không có quyền truy cập trang này!");
    return <Navigate to="/" replace />;
  }

  // Nếu đúng quyền -> render component admin
  return children;
};

export default AdminRoute;
