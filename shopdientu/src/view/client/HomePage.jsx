import React, { useState, useEffect } from 'react';
import ProductCard from '../../components/ProductCard';
import ProductService from '../../api/ProductService';
import CategoryService from '../../api/CategoryService';
import { useNavigate } from 'react-router-dom';

function HomePage() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [searchText, setSearchText] = useState("");
    const [errorSearch, setErrorSearch] = useState("");

    const [isLoadingProducts, setIsLoadingProducts] = useState(true);
    const [isLoadingCategories, setIsLoadingCategories] = useState(true);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await CategoryService.getAll();
                setCategories(data || []);
            } catch (err) {
                console.error("Lỗi khi lấy danh mục:", err);
            } finally {
                setIsLoadingCategories(false);
            }
        };
        fetchCategories();
    }, []);

    // Lấy sản phẩm
    useEffect(() => {
        const fetchProducts = async () => {
            setIsLoadingProducts(true);
            try {
                let productList = [];
                if (selectedCategory) {
                    productList = await ProductService.getByCategory(selectedCategory);
                } else {
                    productList = await ProductService.getAllProducts();
                }
                setProducts(productList || []);
            } catch (err) {
                setError('Không thể tải danh sách sản phẩm. Vui lòng thử lại sau.');
                console.error("Lỗi khi lấy sản phẩm:", err);
            } finally {
                setIsLoadingProducts(false);
            }
        };
        fetchProducts();
    }, [selectedCategory]);

    // Chuyển trang theo Category
    const handleClick = (catId) => {
        navigate(`/search?category=${catId}`);
    };

    // Xử lý tìm kiếm
    const handleSearch = () => {
        if (!searchText.trim()) {
            setErrorSearch("Vui lòng nhập từ khóa.");
            return;
        }
        if (searchText.trim().length < 2) {
            setErrorSearch("Từ khóa phải có ít nhất 2 ký tự.");
            return;
        }
        setErrorSearch("");
        navigate(`/search?keyword=${searchText.trim()}`);
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    };

    return (
        <div className="w-full p-6 lg:p-12">

            {/* Ô tìm kiếm */}
            <div className="max-w-xl mx-auto mb-8 text-center">
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

            <h1 className="text-3xl font-bold text-center mb-8">Danh mục sản phẩm</h1>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                {categories.map(cat => (
                    <div
                        key={cat.id}
                        className="p-4 border rounded-xl cursor-pointer text-center hover:bg-indigo-600 hover:text-white transition"
                        onClick={() => handleClick(cat.id)}
                    >
                        {cat.name}
                    </div>
                ))}
            </div>

            <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">
                Sản phẩm nổi bật
            </h1>

            {isLoadingProducts ? (
                <p className="text-center text-gray-500 text-lg">Đang tải sản phẩm...</p>
            ) : error ? (
                <p className="text-center text-red-500 text-lg">{error}</p>
            ) : products.length === 0 ? (
                <p className="text-center text-gray-500 text-lg">Không tìm thấy sản phẩm nào.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            )}
        </div>
    );
}

export default HomePage;
