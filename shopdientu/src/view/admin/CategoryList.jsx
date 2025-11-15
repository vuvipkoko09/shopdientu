import { useEffect, useState } from "react";
import CategoryService from "../../api/CategoryService";
import Modal from "../../components/Model";
import CategoryForm from "./CategoryForm";
import "../../css/category.css";
export default function CategoryList() {
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);

  const fetchCategories = () => {
    CategoryService.getAll()
      .then((res) => setCategories(res))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchCategories();
  }, []);
  const handleOpenAddModal = () => {
    setCurrentCategory(null);
    setIsModalOpen(true);
  };
  const handleOpenEditModal = (category) => {
    setCurrentCategory(category);
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentCategory(null);
  };
  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa danh mục này?")) {
      CategoryService.delete(id)
        .then(() => {
          setCategories((prev) => prev.filter((cat) => cat.id !== id));
        })
        .catch((err) => {
          console.error(err);
          alert("Lỗi: Không thể xóa danh mục.");
        });
    }
  };
  const handleSaveSuccess = (savedCategory) => {
    if (currentCategory) {
      setCategories((prev) =>
        prev.map((cat) =>
          cat.id === savedCategory.id ? savedCategory : cat
        )
      );
    } else {
      setCategories((prev) => [...prev, savedCategory]);
    }
    handleCloseModal();
  };
  const modalTitle = currentCategory ? "Sửa danh mục" : "Thêm danh mục mới";
  const noDataRow = (
    <tr className="no-data-row">
      <td colSpan="3">Không có dữ liệu</td>
    </tr>
  );

  return (
    <div style={{ padding: 20 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h2>Danh sách danh mục</h2>
        <button
          onClick={handleOpenAddModal}
          style={{
            padding: "10px 15px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "1rem"
          }}
        >
          + Thêm mới
        </button>
      </div>

      <table className="category-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên danh mục</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {categories.length === 0
            ? noDataRow
            : categories.map((c) => (
              <tr key={c.id}>
                <td>{c.id}</td>
                <td>{c.name}</td>

                <td className="action-cell">
                  <button
                    className="btn-edit"
                    onClick={() => handleOpenEditModal(c)} 
                  >
                    Sửa
                  </button>
                  <button
                    className="btn-delete"
                    onClick={() => handleDelete(c.id)} 
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
<Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={modalTitle}
      >
        <CategoryForm
          onSuccess={handleSaveSuccess} 
          categoryToEdit={currentCategory} 
        />
      </Modal>
    </div>
  );
}
