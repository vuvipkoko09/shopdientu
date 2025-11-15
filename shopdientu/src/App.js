import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import "./App.css";

import AdminLayout from "./layouts/Adminlayout";
import ClientLayout from "./layouts/Clientlayout";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AdminDashboard from "./view/admin/Dashboard";
import HomePage from "./view/client/HomePage";
import ProductPage from "./view/admin/ProductPage";
import CategoryList from "./view/admin/CategoryList";
import UserPage from "./view/admin/UserPage";
import { useAutoLogout } from "./components/useAutoLogout";
import AdminRoute from "./components/AdminRouter";
import SearchPage from "./view/client/SearchPage";
import ProductDetail from "./view/client/ProductDetail";
function App() {
  useAutoLogout();
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route path="/" element={<ClientLayout />}>
          <Route index element={<HomePage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/products/:id" element={<ProductDetail />} />
        </Route>
        <Route
          element={
            <AdminRoute>
              <AdminLayout>
                <Outlet />
              </AdminLayout>
            </AdminRoute>
          }
        >
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/products" element={<ProductPage />} />
          <Route path="/admin/categories" element={<CategoryList />} />
          <Route path="/admin/users" element={<UserPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
