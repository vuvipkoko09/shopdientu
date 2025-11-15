import React, { useEffect, useState } from "react";
import ProductService from "../../api/ProductService";
import axios from "axios";
import CategoryService from "../../api/CategoryService";
function ProductForm({ onSuccess, productToEdit }) {
  // State cho các trường text
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    quantity: "",
    categoryId: "",
  });
  const [errors, setErrors] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };
  const [categories, setCategories] = useState([]); // <-- THÊM
  useEffect(() => {
    if (productToEdit) {
      setForm({
        name: productToEdit.name,
        description: productToEdit.description || "",
        price: productToEdit.price,
        quantity: productToEdit.quantity,
        categoryId: productToEdit.categoryId || "",
      });
      setSelectedFile(null); // Xóa file đã chọn (nếu có)
      setErrors({}); // Xóa lỗi cũ
    } else {
      // Chế độ Thêm: Reset form
      setForm({ name: "", description: "", price: "", quantity: "", categoryId: "" });
      setSelectedFile(null);
      setErrors({});
    }
  }, [productToEdit]);
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await CategoryService.getAll();
        setCategories(data || []);
      } catch (error) {
        console.error("Không thể tải danh mục:", error);
      }
    };

    fetchCategories();
  }, []);
  const validateForm = () => {
    const newErrors = {};
    const isEditMode = !!productToEdit;

    // Kiểm tra Tên
    if (!form.name.trim()) {
      newErrors.name = "Tên sản phẩm không được để trống";
    }

    // Kiểm tra Giá
    if (!form.price) {
      newErrors.price = "Giá không được để trống";
    } else if (parseFloat(form.price) <= 0) {
      newErrors.price = "Giá phải là một số dương";
    }
    // --- THÊM VALIDATE CHO CATEGORY ---
    if (!form.categoryId) { // <-- THÊM
      newErrors.categoryId = "Vui lòng chọn một danh mục";
    }
    // Kiểm tra Số lượng
    if (!form.quantity) {
      newErrors.quantity = "Số lượng không được để trống";
    } else if (parseInt(form.quantity, 10) < 0) {
      newErrors.quantity = "Số lượng không được âm";
    }

    if (!isEditMode && !selectedFile) {
      newErrors.file = "Vui lòng chọn hình ảnh sản phẩm";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    const isEditMode = !!productToEdit;
    setIsUploading(true);
    try {
      let imageUrl;

      if (selectedFile) {
        // 1. Nếu có file mới được chọn (cả Thêm và Sửa) -> Upload file
        const uploadResponse = await ProductService.uploadImage(selectedFile, "products");
        imageUrl = uploadResponse.filePath;
      } else if (isEditMode) {
        // 2. Nếu ở chế độ Sửa và không chọn file mới -> Dùng lại ảnh cũ
        imageUrl = productToEdit.imageUrl;
      }
      // (Trường hợp Thêm mới và không chọn file đã bị validateForm chặn)

      const productPayload = {
        name: form.name,
        description: form.description,
        price: parseFloat(form.price),
        quantity: parseInt(form.quantity, 10),
        imageUrl: imageUrl, // Dùng imageUrl đã được xác định
        categoryId: parseInt(form.categoryId, 10)
      };

      if (isEditMode) {
        // --- CHẠY API UPDATE ---
        await ProductService.updateProduct(productToEdit.id, productPayload);
        alert("Cập nhật sản phẩm thành công!");
      } else {
        // --- CHẠY API CREATE ---
        await ProductService.createProduct(productPayload);
        alert("Thêm sản phẩm thành công!");
      }
      onSuccess();
    } catch (error) {
      console.error("Lỗi khi lưu sản phẩm:", error);
      if (error.response && error.response.status === 400) {
        setErrors(error.response.data);
      } else {
        alert("Lưu thất bại!");
      }
    } finally {
      setIsUploading(false);
    }
  };

  // === TÊN NÚT DYNAMIC ===
  const buttonText = productToEdit ? "Lưu thay đổi" : "➕ Thêm";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <input
        type="text"
        placeholder="Tên sản phẩm"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        className={`border px-3 py-2 rounded w-full ${errors.name ? 'border-red-500' : ''}`} // Thêm class lỗi
      />
      {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}

      <input
        type="text"
        placeholder="Mô tả"
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
        className="border px-3 py-2 rounded w-full"
      />

      <div>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="mt-1 block w-full ..."
        />
      </div>
      {errors.file && <p className="text-red-500 text-sm">{errors.file}</p>}

      {/* 8. THÊM DROPDOWN (SELECT) CHO CATEGORY */}
      <div>
        <select
          value={form.categoryId}
          onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
          className={`border px-3 py-2 rounded w-full ${errors.categoryId ? 'border-red-500' : ''}`}
        >
          <option value="">-- Chọn danh mục --</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        {errors.categoryId && <p className="text-red-500 text-sm">{errors.categoryId}</p>}
      </div>

      <div className="flex gap-3">
        <div className="w-1/2"> {/* Bọc lại để hiển thị lỗi */}
          <input
            type="number"
            placeholder="Giá"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            className={`border px-3 py-2 rounded w-full ${errors.price ? 'border-red-500' : ''}`}
          />
          {errors.price && <p className="text-red-500 text-sm">{errors.price}</p>}
        </div>
        <div className="w-1/2">
          <input
            type="number"
            placeholder="Số lượng"
            value={form.quantity}
            onChange={(e) => setForm({ ...form, quantity: e.target.value })}
            className={`border px-3 py-2 rounded w-full ${errors.quantity ? 'border-red-500' : ''}`}
          />
          {errors.quantity && <p className="text-red-500 text-sm">{errors.quantity}</p>}
        </div>
      </div>
      <button
        type="submit"
        className={`bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 transition ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
        disabled={isUploading}
      >
        {isUploading ? "Đang xử lý..." : "➕ Thêm"}
      </button>
    </form>
  );
}

export default ProductForm;