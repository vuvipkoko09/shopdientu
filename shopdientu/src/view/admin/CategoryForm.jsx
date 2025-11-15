
import React, { useEffect, useState } from "react";
import CategoryService from "../../api/CategoryService";
/**
 * Form để THÊM hoặc SỬA danh mục
 * @param {function} onSuccess - Callback khi lưu thành công
 * @param {object | null} categoryToEdit - Dữ liệu của category đang sửa (null nếu là thêm mới)
 */
function CategoryForm({ onSuccess, categoryToEdit }) {
    const [name, setName] = useState("");
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    useEffect(() => {
        if (categoryToEdit) {
            // Nếu có dữ liệu để sửa, set state 'name'
            setName(categoryToEdit.name);
        } else {
            // Nếu là "thêm mới", reset form
            setName("");
        }
    }, [categoryToEdit]);
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name.trim()) {
            setError("Tên danh mục không được để trống");
            return;
        }

        setIsLoading(true);
        setError(null);

        // Xác định xem đây là chế độ Sửa hay Thêm
        const isEditMode = !!categoryToEdit;
        const payload = { name: name };

        // Tạo lời hứa (promise) cho API
        const apiCall = isEditMode
            ? CategoryService.update(categoryToEdit.id, payload)
            : CategoryService.create(payload);

        apiCall
            .then((savedCategory) => {
                // Chỉ cần gọi onSuccess, component cha sẽ xử lý phần còn lại
                onSuccess(savedCategory);
            })
            .catch((err) => {
                console.error(err);
                setError("Đã xảy ra lỗi khi lưu danh mục.");
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    return (
        <form onSubmit={handleSubmit}>
            {/* Ô nhập liệu */}
            <div style={{ marginBottom: "16px" }}>
                <label
                    htmlFor="categoryName"
                    style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}
                >
                    Tên danh mục
                </label>
                <input
                    id="categoryName"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nhập tên danh mục..."
                    style={{
                        width: "100%",
                        padding: "10px",
                        borderRadius: "4px",
                        border: "1px solid #ccc",
                    }}
                    disabled={isLoading}
                />
            </div>

            {/* Thông báo lỗi */}
            {error && <p style={{ color: "red", fontSize: "0.875rem" }}>{error}</p>}

            {/* Nút Submit */}
            <div style={{ textAlign: "right" }}>
                <button
                    type="submit"
                    disabled={isLoading}
                    style={{
                        padding: "10px 20px",
                        backgroundColor: isLoading ? "#ccc" : "#007bff",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                    }}
                >
                    {isLoading ? "Đang lưu..." : "Lưu"}
                </button>
            </div>
        </form>
    );
}

export default CategoryForm;