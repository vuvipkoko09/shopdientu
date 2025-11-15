import React from "react";
import { Home, Box, Users, LogOut } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";

// 1. Import thêm hook và service cần thiết
import AuthService from '../api/AuthService';

const Sidebar = ({ isOpen }) => {
  const location = useLocation();
  const navigate = useNavigate(); // Dùng để điều hướng sau khi logout

  // 2. SỬA LẠI ĐƯỜNG DẪN CHO ĐÚNG ROUTE CỦA ADMIN
  const menuItems = [
    { name: "Dashboard", icon: <Home size={20} />, path: "/admin/Dashboard" },
    { name: "Sản phẩm", icon: <Box size={20} />, path: "/admin/products" },
    { name: "Danh mục", icon: <Users size={20} />, path: "/admin/categories" },
    { name: "Người dùng", icon: <Users size={20} />, path: "/admin/users" }, // Sửa lại cho khớp App.js

  ];

  // 3. TẠO HÀM XỬ LÝ ĐĂNG XUẤT
  const handleLogout = () => {
    AuthService.logout(); // Xóa token khỏi localStorage
    navigate('/login');   // Điều hướng về trang login
  };

  return (
    <div
      style={{
        width: "250px",
        height: "100vh",
        backgroundColor: "#ffffff",
        borderRight: "1px solid #e5e7eb",
        boxShadow: "2px 0 8px rgba(0,0,0,0.05)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "20px 0",
        position: "fixed",
        top: 0,
        left: isOpen ? "0" : "-250px",
        transition: "left 0.3s ease-in-out",
        zIndex: 1000
      }}
    >
      <div>
        <h2 style={{ textAlign: "center", marginBottom: "30px", fontWeight: "700", fontSize: "1.2rem" }}>
          Admin Panel
        </h2>

        {menuItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            style={{
              display: "flex", alignItems: "center", gap: "10px", padding: "10px 20px", textDecoration: "none",
              color: location.pathname === item.path ? "#2563eb" : "#374151",
              backgroundColor: location.pathname === item.path ? "#eff6ff" : "transparent",
              fontWeight: location.pathname === item.path ? "600" : "400",
              transition: "all 0.2s ease",
            }}
          >
            {item.icon}
            <span>{item.name}</span>
          </Link>
        ))}
      </div>

      {/* 4. GÁN HÀM handleLogout VÀO SỰ KIỆN onClick */}
      <button
        onClick={handleLogout}
        style={{ display: "flex", alignItems: "center", gap: "10px", margin: "0 20px", padding: "10px", border: "none", backgroundColor: "#ef4444", color: "white", borderRadius: "6px", cursor: "pointer", fontWeight: "500" }}
      >
        <LogOut size={20} />
        Đăng xuất
      </button>
    </div>
  );
};

export default Sidebar;
