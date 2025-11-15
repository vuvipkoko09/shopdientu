import React from "react";
import { Link } from "react-router-dom";
const BACKEND_URL = "http://localhost:8080";

function ProductCard({ product }) {
  const formattedPrice = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(product.price);


  const imageUrl = product.imageUrl
    ? `${BACKEND_URL}${product.imageUrl}`
    : "https://via.placeholder.com/400x300?text=Product+Image";
  return (
    <div
      key={product.id}
      className="bg-white rounded-lg shadow-lg overflow-hidden transform transition-transform duration-300 hover:scale-105"
    >
      <img
        src={imageUrl}
        alt={product.name}
        className="w-full h-56 object-cover"
      />
      <div className="p-4">
        <h3
          className="text-lg font-semibold text-gray-800 truncate"
          title={product.name}
        >
          {product.name}
        </h3>
        <p className="text-indigo-600 font-bold mt-2">{formattedPrice}</p>
        <Link
          to={`/products/${product.id}`}
          className="mt-4 inline-block px-5 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Xem chi tiết
        </Link>
      </div>
    </div>
  );
}

export default ProductCard;
