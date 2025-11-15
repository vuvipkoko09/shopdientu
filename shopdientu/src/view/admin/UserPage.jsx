import React, { useEffect, useState } from "react";
import UserService from "../../api/UserService";
import "../../css/category.css"; // Tái sử dụng CSS từ CategoryList
import Modal from "../../components/Model"; // <-- Import Modal
import UserForm from "./UserForm";
import { Plus } from 'lucide-react';
function UserPage() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [userToEdit, setUserToEdit] = useState(null);

    useEffect(() => {
        fetchUsers(); // Tách ra hàm riêng
    }, []);
    const fetchUsers = () => {
        setLoading(true);
        UserService.getAll()
            .then((res) => {
                setUsers(res);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Lỗi khi tải danh sách người dùng:", err);
                if (err.response && err.response.status === 403) {
                    setError("Bạn không có quyền truy cập tài nguyên này.");
                } else {
                    setError("Không thể tải dữ liệu.");
                }
                setLoading(false);
            });
    };

    const handleDelete = (id) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa người dùng này?")) {
            UserService.delete(id)
                .then(() => {
                    // Xóa thành công, lọc user ra khỏi state
                    setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
                })
                .catch((err) => {
                    console.error("Lỗi khi xóa:", err);
                    alert("Không thể xóa người dùng.");
                });
        }
    };

    const handleOpenAddModal = () => {
        setUserToEdit(null); // Đặt là null để Form biết đây là "Thêm"
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (user) => {
        setUserToEdit(user);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setUserToEdit(null); // Luôn reset khi đóng
    };

    // Sửa tên hàm: Giờ nó xử lý cho cả "Thêm" và "Sửa"
    const handleSaveSuccess = (savedUser) => {
        if (userToEdit) {
            // Chế độ Sửa: Cập nhật user trong danh sách
            setUsers((prevUsers) =>
                prevUsers.map((user) =>
                    user.id === savedUser.id ? savedUser : user
                )
            );
        } else {
            // Chế độ Thêm: Thêm user mới vào danh sách
            // (Hoặc đơn giản là tải lại toàn bộ danh sách)
            fetchUsers(); // Tải lại list để lấy user mới nhất
        }
        handleCloseModal(); // Đóng modal
    };

    // Tự động đổi tiêu đề Modal
    const modalTitle = userToEdit ? "Sửa thông tin người dùng" : "Thêm người dùng mới";

    // (if loading, if error ... giữ nguyên)
    if (loading) {
        return <div style={{ padding: 20 }}>Đang tải dữ liệu...</div>;
    }
    if (error) {
        return <div style={{ padding: 20, color: "red" }}>Lỗi: {error}</div>;
    }

    return (
        <div style={{ padding: 20 }}>
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 20
                }}
            >
                <h2>Quản lý người dùng</h2>
                <button
                    onClick={handleOpenAddModal} // <-- Gọi hàm mở modal Thêm
                    style={{
                        padding: "10px 15px",
                        backgroundColor: "#007bff",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontSize: "1rem",
                        display: "flex",
                        alignItems: "center",
                        gap: "4px"
                    }}
                >
                    <Plus size={18} />
                    Thêm mới
                </button>
            </div>
            <table className="category-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Tên</th>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Số điện thoại</th>
                        <th>Quyền (Role)</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {users.length === 0 ? (
                        <tr className="no-data-row">
                            <td colSpan="7">Không có dữ liệu người dùng</td>
                        </tr>
                    ) : (
                        users.map((user) => (
                            <tr key={user.id}>
                                <td>{user.id}</td>
                                <td>{user.name}</td>
                                <td>{user.username}</td>
                                <td>{user.email}</td>
                                <td>{user.phoneNumber}</td>
                                <td>{user.role}</td>
                                <td className="action-cell">
                                    <button
                                        className="btn-edit"
                                        onClick={() => handleOpenEditModal(user)}
                                    >
                                        Sửa
                                    </button>
                                    <button
                                        className="btn-delete"
                                        onClick={() => handleDelete(user.id)}
                                    >
                                        Xóa
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
            {isModalOpen && (
                <Modal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    title={modalTitle} // <-- Tiêu đề động
                >
                    <UserForm
                        userToEdit={userToEdit}
                        onSuccess={handleSaveSuccess} // <-- Dùng hàm save mới
                    />
                </Modal>
            )}
        </div>
    );
}

export default UserPage;