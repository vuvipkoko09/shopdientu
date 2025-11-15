import React, { useEffect, useMemo, useState } from "react";
import ProductService from "../../api/ProductService";
import CategoryService from "../../api/CategoryService";
import ProductForm from "./ProductForm";
import Modal from "../../components/Model";
import { Plus, Pencil } from 'lucide-react';

const BACKEND_URL = "http://localhost:8080";

function ProductPage() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [min, setMin] = useState("");
  const [max, setMax] = useState("");
  const [refresh, setRefresh] = useState(false);
  const [categories, setCategories] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null);

  // Load products và categories
  useEffect(() => {
    ProductService.getAllProducts()
      .then(res => setProducts(res))
      .catch(err => console.error(err));

    CategoryService.getAll()
      .then(res => setCategories(res))
      .catch(err => console.error(err));
  }, [refresh]);

  const categoryMap = useMemo(() => {
    return categories.reduce((map, cat) => {
      map[cat.id] = cat.name;
      return map;
    }, {});
  }, [categories]);

  // ---------------- SEARCH ----------------
  const handleSearch = () => {
    const trimmed = search.trim();

    // 1. Rỗng hoặc chỉ khoảng trắng
    if (trimmed === "") {
      alert("Vui lòng nhập tên sản phẩm hợp lệ!");
      setSearch("");
      return;
    }

    // 2. Kiểm tra ký tự đặc biệt
    const specialCharPattern = /[!@#$%^&*(),.?":{}|<>]/;
    if (specialCharPattern.test(trimmed)) {
      alert("Tên sản phẩm không được chứa ký tự đặc biệt!");
      return;
    }

    // 3. Kiểm tra độ dài
    if (trimmed.length < 1) {
      alert("Tên sản phẩm phải có ít nhất 2 ký tự!");
      return;
    }

    if (trimmed.length > 50) {
      alert("Tên sản phẩm không được vượt quá 50 ký tự!");
      return;
    }

    // Nếu hợp lệ → gọi API tìm kiếm
    ProductService.searchByName(trimmed)
      .then(res => setProducts(res))
      .catch(err => console.error(err));
  };


  // ---------------- FILTER ----------------
  const handleFilter = () => {
    const minPrice = parseFloat(min);
    const maxPrice = parseFloat(max);

    if (isNaN(minPrice) || isNaN(maxPrice)) {
      alert("Vui lòng nhập cả giá min và giá max hợp lệ!");
      return;
    }

    if (minPrice > maxPrice) {
      alert("Giá min không được lớn hơn giá max!");
      return;
    }

    ProductService.filterByPrice(minPrice, maxPrice)
      .then(res => setProducts(res))
      .catch(err => console.error(err));
  };

  const handleResetFilters = () => {
    setSearch("");
    setMin("");
    setMax("");
    setRefresh(!refresh); // load lại tất cả
  };

  // ---------------- DELETE ----------------
  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc muốn xóa không?")) {
      ProductService.deleteProduct(id)
        .then(() => setRefresh(!refresh))
        .catch(err => console.error(err));
    }
  };

  // ---------------- MODAL ----------------
  const handleOpenAddModal = () => {
    setProductToEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product) => {
    setProductToEdit(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setProductToEdit(null);
  };

  const handleFormSuccess = () => {
    setRefresh(!refresh);
    setIsModalOpen(false);
  };

  const modalTitle = productToEdit ? "Sửa sản phẩm" : "Thêm sản phẩm mới";

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Quản lý sản phẩm</h2>

      {/* Search + Filter */}
      <div className="flex items-center gap-2 mb-4">

        <input
          type="text"
          placeholder="Tìm theo tên..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-3 py-2 rounded-lg"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          Tìm
        </button>

        <input
          type="number"
          placeholder="Giá min"
          value={min}
          onChange={(e) => setMin(e.target.value)}
          className="border px-3 py-2 rounded-lg w-32"
        />
        <input
          type="number"
          placeholder="Giá max"
          value={max}
          onChange={(e) => setMax(e.target.value)}
          className="border px-3 py-2 rounded-lg w-32"
        />
        <button
          onClick={handleFilter}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
        >
          Lọc giá
        </button>

        <button
          onClick={handleResetFilters}
          className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500"
        >
          Reset
        </button>

        <button
          onClick={handleOpenAddModal}
          className="ml-auto bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-1 hover:bg-blue-700"
        >
          <Plus size={18} />
          Thêm mới
        </button>
      </div>

      {/* Product table */}
      <table className="min-w-full bg-white border rounded-lg mt-4">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">ID</th>
            <th className="p-2 border">Hình ảnh</th>
            <th className="p-2 border">Tên</th>
            <th className="p-2 border">Mô tả</th>
            <th className="p-2 border">Danh mục</th>
            <th className="p-2 border">Giá</th>
            <th className="p-2 border">Số lượng</th>
            <th className="p-2 border">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => {
            const imageUrl = p.imageUrl
              ? `${BACKEND_URL}${p.imageUrl}`
              : 'https://via.placeholder.com/100?text=N/A';
            return (
              <tr key={p.id} className="hover:bg-gray-50">
                <td className="p-2 border text-center">{p.id}</td>
                <td className="p-2 border text-center">
                  <img
                    src={imageUrl}
                    alt={p.name}
                    className="w-16 h-16 object-cover mx-auto rounded"
                  />
                </td>
                <td className="p-2 border">{p.name}</td>
                <td className="p-2 border">{p.description}</td>
                <td className="p-2 border">{categoryMap[p.categoryId] || 'N/A'}</td>
                <td className="p-2 border text-right">{p.price.toLocaleString()} ₫</td>
                <td className="p-2 border text-center">{p.quantity}</td>
                <td className="p-2 border text-center">
                  <button
                    onClick={() => handleOpenEditModal(p)}
                    className="text-blue-600 hover:underline mr-3"
                  >
                    <Pencil size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="text-red-500 hover:underline"
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>

      {/* Modal */}
      <Modal
        title={modalTitle}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      >
        <ProductForm
          onSuccess={handleFormSuccess}
          productToEdit={productToEdit}
        />
      </Modal>
    </div>
  );
}

export default ProductPage;
