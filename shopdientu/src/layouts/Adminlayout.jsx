import React, { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { Menu } from 'lucide-react'; // Icon cho nút toggle
import Sidebar from './Sidebar'; // Import Sidebar của bạn
import AuthService from '../api/AuthService';

function AdminLayout() {
    // 1. Tạo state để quản lý việc đóng/mở sidebar, mặc định là mở
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const currentUser = AuthService.getCurrentUser();

    // Logic bảo vệ route (giữ nguyên)
    if (!currentUser.token || currentUser.role !== 'ADMIN') {
        return <Navigate to="/login" />;
    }

    // Hàm để bật/tắt sidebar
    const toggleSidebar = () => {
        setSidebarOpen(!isSidebarOpen);
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f9fafb' }}>
            {/* Luôn render Sidebar và truyền state `isOpen` vào */}
            <Sidebar isOpen={isSidebarOpen} />

            {/* Vùng nội dung chính */}
            <main
                style={{
                    flexGrow: 1,
                    // 2. Dùng marginLeft để đẩy nội dung sang phải khi sidebar mở
                    marginLeft: isSidebarOpen ? '250px' : '0',
                    padding: '24px',
                    transition: 'margin-left 0.3s ease-in-out', // Thêm hiệu ứng cho mượt
                    width: `calc(100% - ${isSidebarOpen ? '250px' : '0px'})` // Đảm bảo nội dung không bị tràn
                }}
            >
                {/* 3. Nút để bật/tắt sidebar (hamburger menu) */}
                <button
                    onClick={toggleSidebar}
                    style={{
                        marginBottom: '16px',
                        padding: '8px',
                        backgroundColor: 'white',
                        border: '1px solid #e5e7eb',
                        borderRadius: '6px',
                        cursor: 'pointer',
                    }}
                >
                    <Menu size={20} />
                </button>

                {/* Đây là nơi các trang con (Dashboard, ProductPage...) sẽ được render */}
                <Outlet />
            </main>
        </div>
    );
}

export default AdminLayout;
