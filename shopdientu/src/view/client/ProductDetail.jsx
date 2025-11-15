import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ProductService from "../../api/ProductService";
const BACKEND_URL = "http://localhost:8080";
function ProductDetail() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true);
            setError("");
            try {
                const response = await ProductService.getProductById(id);
                setProduct(response);
            } catch (err) {
                console.error(err);
                setError("Không thể tải sản phẩm. Vui lòng thử lại sau.");
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);
    if (loading) return <p className="text-center text-gray-500">Đang tải sản phẩm...</p>;
    if (error) return <p className="text-center text-red-500">{error}</p>;
    if (!product) return <p className="text-center text-gray-500">Sản phẩm không tồn tại.</p>;
    const imageUrl = product?.imageUrl ? BACKEND_URL + product.imageUrl : "/placeholder.png";
    return (
        <div className="p-6 max-w-4xl mx-auto">
            <button
                onClick={() => navigate(-1)}
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition mb-6"
            >
                ← Quay lại
            </button>

            <div className="flex flex-col md:flex-row gap-6">
                {/* Ảnh sản phẩm */}
                <div className="flex-1">
                    <img
                        src={imageUrl || "/placeholder.png"}
                        alt={product.name}
                        className="w-full h-auto rounded-xl"
                    />
                </div>

                {/* Thông tin sản phẩm */}
                <div className="flex-1">
                    <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
                    <p className="text-xl text-indigo-600 font-semibold mb-4">
                        Giá: {product.price?.toLocaleString("vi-VN")}₫
                    </p>
                    <p className="text-gray-700 mb-4">{product.description}</p>

                    {/* Các thông tin khác nếu có */}
                    {product.category && (
                        <p className="text-gray-500 mb-2">
                            Danh mục: {product.category.name}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ProductDetail;
