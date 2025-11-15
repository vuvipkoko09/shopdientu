import React, { useState, useEffect } from "react";
import UserService from "../../api/UserService";

/**
 * Form để THÊM (register) hoặc SỬA (update) User
 * @param {object | null} userToEdit - Dữ liệu user (null = chế độ Thêm)
 * @param {function} onSuccess - Callback khi lưu thành công
 */
function UserForm({ userToEdit, onSuccess }) {
    const [form, setForm] = useState({
        // Trường chung cho cả hai
        name: "",
        email: "",
        address: "",
        phoneNumber: "",
        role: "USER",
        // Trường chỉ dùng cho "Thêm"
        username: "",
        password: "",
    });
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const isEditMode = !!userToEdit;
    useEffect(() => {
        if (isEditMode) {
            // Chế độ Sửa: Lấy dữ liệu từ prop
            setForm({
                name: userToEdit.name || "",
                email: userToEdit.email || "",
                address: userToEdit.address || "",
                phoneNumber: userToEdit.phoneNumber || "",
                role: userToEdit.role || "USER",
                username: userToEdit.username || "", // Dùng để hiển thị (nhưng không sửa)
                password: "", // Luôn rỗng
            });
        } else {
            // Chế độ Thêm: Reset tất cả
            setForm({
                name: "", email: "", address: "", phoneNumber: "", role: "USER",
                username: "", password: "",
            });
        }
        setError(null); // Luôn xóa lỗi cũ
    }, [userToEdit, isEditMode]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        if (isEditMode) {
            // --- CHẾ ĐỘ SỬA: Gọi API Update ---
            // (Backend DTO không nhận username/password)
            const updatePayload = {
                name: form.name,
                email: form.email,
                address: form.address,
                phoneNumber: form.phoneNumber,
                role: form.role,
            };

            if (!updatePayload.name.trim() || !updatePayload.email.trim()) {
                setError("Tên và Email không được để trống");
                setIsLoading(false);
                return;
            }

            UserService.update(userToEdit.id, updatePayload)
                .then((updatedUser) => {
                    onSuccess(updatedUser); // Gửi user đã cập nhật về
                })
                .catch((err) => {
                    console.error(err);
                    setError("Lỗi khi cập nhật. Email có thể đã bị trùng.");
                })
                .finally(() => setIsLoading(false));

        } else {
            // --- CHẾ ĐỘ THÊM: Gọi API Register ---
            // (Backend DTO cần tất cả các trường)
            const registerPayload = {
                name: form.name,
                email: form.email,
                address: form.address,
                phoneNumber: form.phoneNumber,
                role: form.role, // Backend của bạn tự gán "USER", nhưng gửi vẫn tốt
                username: form.username,
                password: form.password,
            };

            if (!registerPayload.username || !registerPayload.password || !registerPayload.email) {
                setError("Username, Password và Email là bắt buộc");
                setIsLoading(false);
                return;
            }

            UserService.register(registerPayload)
                .then((registeredUser) => {
                    onSuccess(registeredUser); // Gửi user mới về (API register của bạn trả về LoginResponse)
                })
                .catch((err) => {
                    console.error(err);
                    setError("Lỗi khi đăng ký. Username hoặc Email có thể đã tồn tại.");
                })
                .finally(() => setIsLoading(false));
        }
    };

    // --- Tên nút và tiêu đề động ---
    const buttonText = isEditMode ? "Lưu thay đổi" : "Tạo người dùng";

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">

            {/* === TRƯỜNG CHỈ HIỂN THỊ KHI "THÊM" === */}
            {!isEditMode && (
                <>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tên đăng nhập (Username)</label>
                        <input
                            type="text" name="username"
                            value={form.username} onChange={handleChange}
                            className="border px-3 py-2 rounded w-full"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu</label>
                        <input
                            type="password" name="password"
                            value={form.password} onChange={handleChange}
                            className="border px-3 py-2 rounded w-full"
                        />
                    </div>
                </>
            )}

            {/* === TRƯỜNG DÙNG CHUNG === */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tên</label>
                <input
                    type="text" name="name"
                    value={form.name} onChange={handleChange}
                    className="border px-3 py-2 rounded w-full"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                    type="email" name="email"
                    value={form.email} onChange={handleChange}
                    className="border px-3 py-2 rounded w-full"
                />
            </div>

            {/* Địa chỉ */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ</label>
                <input
                    type="text" name="address"
                    value={form.address} onChange={handleChange}
                    className="border px-3 py-2 rounded w-full"
                />
            </div>

            {/* Số điện thoại */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                <input
                    type="text" name="phoneNumber"
                    value={form.phoneNumber} onChange={handleChange}
                    className="border px-3 py-2 rounded w-full"
                />
            </div>

            {/* Quyền (Role) */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quyền</label>
                <select
                    name="role" value={form.role} onChange={handleChange}
                    className="border px-3 py-2 rounded w-full bg-white"
                >
                    <option value="USER">USER</option>
                    <option value="ADMIN">ADMIN</option>
                </select>
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
                type="submit"
                className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 transition"
                disabled={isLoading}
            >
                {isLoading ? "Đang lưu..." : "Lưu thay đổi"}
            </button>
        </form>
    );
}

export default UserForm;