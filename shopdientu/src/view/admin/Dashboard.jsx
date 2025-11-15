import React, { useEffect, useState } from "react";
import ProductService from "../../api/ProductService";

const Dashboard = () => {
  const [stats, setStats] = useState({ products: 0, users: 0, orders: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const res = await ProductService.getAllProducts();
        const productCount = Array.isArray(res) ? res.length : 0;

        setStats({
          products: productCount,
          users: 0, // tạm để số giả — sau có API user thì call tương tự
          orders: 0,
        });
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  if (loading) return <div className="p-8 text-gray-600">Đang tải dữ liệu...</div>;

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Tổng quan</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white shadow-md rounded-xl p-6 text-center">
          <h2 className="text-gray-500 text-sm">Sản phẩm</h2>
          <p className="text-3xl font-bold mt-2 text-blue-600">
            {stats.products}
          </p>
        </div>

        <div className="bg-white shadow-md rounded-xl p-6 text-center">
          <h2 className="text-gray-500 text-sm">Người dùng</h2>
          <p className="text-3xl font-bold mt-2 text-green-600">{stats.users}</p>
        </div>

        <div className="bg-white shadow-md rounded-xl p-6 text-center">
          <h2 className="text-gray-500 text-sm">Đơn hàng</h2>
          <p className="text-3xl font-bold mt-2 text-purple-600">
            {stats.orders}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
