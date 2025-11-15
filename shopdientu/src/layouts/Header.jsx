import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthService from '../api/AuthService.js';

function Header() {
    const navigate = useNavigate();
    const currentUser = AuthService.getCurrentUser();
    const isAdmin = currentUser?.role === "ROLE_ADMIN";
    const handleLogout = () => {
        AuthService.logout();
        navigate("/login");
        window.location.reload();
    };

    return (
        <nav className="bg-white shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="text-2xl font-bold text-indigo-600">
                            MyApp
                        </Link>
                    </div>
                    <div className="flex items-center space-x-4">
                        {currentUser ? (
                            <>
                                <Link to="/dashboard" className="text-gray-700 hover:text-indigo-600">
                                    Dashboard
                                </Link>

                                {isAdmin ? (
                                    <Link to="/admin/dashboard">Admin</Link>
                                ) : (
                                    <span>{currentUser.name}</span>
                                )}

                                <button
                                    onClick={handleLogout}
                                    className="px-3 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                                >
                                    Đăng xuất
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="text-gray-700 hover:text-indigo-600">
                                    Đăng nhập
                                </Link>
                                <Link
                                    to="/register"
                                    className="px-3 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                                >
                                    Đăng ký
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default Header;
