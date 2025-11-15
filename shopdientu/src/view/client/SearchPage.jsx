import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProductService from "../../api/ProductService";
import CategoryService from "../../api/CategoryService";
import ProductCard from "../../components/ProductCard";

function SearchPage() {
    const navigate = useNavigate();

    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [categoryId, setCategoryId] = useState("");
    const [categoryName, setCategoryName] = useState("");
    const [searchText, setSearchText] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [errorSearch, setErrorSearch] = useState("");

    // Lấy danh mục khi load trang
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await CategoryService.getAll();
                setCategories(data || []);
            } catch (err) {
                console.error("Lỗi khi lấy danh mục:", err);
            }
        };
        fetchCategories();
    }, []);

    // Click category
    const handleCategoryClick = async (catId) => {
        setCategoryId(catId);
        setSearchText(""); // xóa keyword khi chọn category
        setLoading(true);
        setError("");
        try {
            const data = await ProductService.getByCategory(catId);
            const category = await CategoryService.getOne(catId);
            setProducts(data || []);
            setCategoryName(category?.name || "Không xác định");
        } catch (err) {
            console.error(err);
            setError("Không thể tải sản phẩm. Vui lòng thử lại sau.");
        } finally {
            setLoading(false);
        }
    };

    // Tìm kiếm theo keyword
    const handleSearch = async () => {
        if (!searchText.trim()) {
            setErrorSearch("Vui lòng nhập từ khóa.");
            return;
        }
        if (searchText.trim().length < 2) {
            setErrorSearch("Từ khóa phải có ít nhất 2 ký tự.");
            return;
        }
        setErrorSearch("");
        setCategoryId(""); // xóa category khi search từ khóa
        setLoading(true);
        setError("");
        try {   
            const data = await ProductService.searchByName(searchText.trim());
            setProducts(data || []);
            setCategoryName(""); // không hiển thị category
        } catch (err) {
            console.error(err);
            setError("Không thể tìm sản phẩm. Vui lòng thử lại sau.");
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    };

    const displayTitle = searchText ? `"${searchText}"` : categoryName || "Không xác định";

    return (
        <div className="p-6">
            {/* Nút lùi */}
            <button
                onClick={() => navigate("/")}
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition mb-4"
            >
                ← Quay lại
            </button>

            {/* Thanh tìm kiếm */}
            <div className="max-w-xl mx-auto mb-6 text-center">
                <input
                    type="text"
                    placeholder="Tìm sản phẩm..."
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="w-full p-3 border rounded-xl shadow-sm focus:outline-none focus:ring focus:ring-indigo-300"
                />
                {errorSearch && (
                    <p className="text-red-500 text-sm mt-1">{errorSearch}</p>
                )}
                <button
                    onClick={handleSearch}
                    className="mt-3 px-6 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition"
                >
                    Tìm kiếm
                </button>
            </div>

            {/* Bảng danh mục */}
            <h2 className="text-xl font-bold mb-4">Danh mục sản phẩm</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
                {categories.map(cat => (
                    <div
                        key={cat.id}
                        className={`p-2 border rounded-xl cursor-pointer text-center hover:bg-indigo-600 hover:text-white transition ${
                            cat.id.toString() === categoryId ? "bg-indigo-600 text-white" : ""
                        }`}
                        onClick={() => handleCategoryClick(cat.id)}
                    >
                        {cat.name}
                    </div>
                ))}
            </div>

            {/* Tiêu đề kết quả */}
            <h1 className="text-2xl font-bold mb-6">
                Kết quả tìm kiếm — <span className="text-blue-600">{displayTitle}</span>
            </h1>

            {/* Loading / Error */}
            {loading ? (
                <p className="text-center text-gray-500 text-lg">Đang tải dữ liệu...</p>
            ) : error ? (
                <p className="text-center text-red-500 text-lg">{error}</p>
            ) : products.length === 0 ? (
                <p className="text-center text-gray-500 text-lg">Không có sản phẩm nào.</p>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {products.map((p) => (
                        <ProductCard key={p.id} product={p} />
                    ))}
                </div>
            )}
        </div>
    );
}

export default SearchPage;
