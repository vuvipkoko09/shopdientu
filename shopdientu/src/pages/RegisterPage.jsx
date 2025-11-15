import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthService from "../api/AuthService";
import styles from '../css/LoginPage.module.css'; // Dùng lại file CSS của Login

function RegisterPage() {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        name: "",
        address: "",
        phoneNumber: ""
    });
    const [message, setMessage] = useState("");
    const [isError, setIsError] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setMessage("");
        setIsError(false);

        if (formData.password !== formData.confirmPassword) {
            setMessage("❌ Mật khẩu không khớp!");
            setIsError(true);
            return;
        }

        try {
            // SỬA 1: Gửi toàn bộ object formData
            // AuthService.register sẽ tự động lưu token và role
            const data = await AuthService.register(formData);

            setMessage("✅ Đăng ký thành công! Đang đăng nhập...");
            setIsError(false);

            // SỬA 2: Đăng nhập thành công, kiểm tra role và điều hướng
            setTimeout(() => {
                if (data.role === "ROLE_ADMIN") {
                    navigate("/admin/dashboard");
                } else {
                    navigate("/dashboard"); // Điều hướng đến dashboard
                }
                window.location.reload(); // Tải lại để Header cập nhật
            }, 1500);

        } catch (error) {
            // SỬA 3: Lấy lỗi từ response của Spring Boot (nếu có)
            const resMessage =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString();

            setMessage(`❌ Đăng ký thất bại! ${resMessage}`);
            setIsError(true);
            console.error(error);
        }
    };

    return (
        <div className={styles.loginContainer}> {/* Dùng lại class của Login */}
            <div className={styles.loginFormContainer}> {/* Dùng lại class của Login */}
                <h2 className={styles.loginTitle}>✍️ Đăng ký tài khoản</h2>
                <form onSubmit={handleRegister} className={styles.form}>
                    <div className={styles.formGrid}>
                        <div>
                            <label htmlFor="name" className={styles.formLabel}>Tên của bạn</label>
                            <input
                                type="text" id="name" name="name"
                                value={formData.name} onChange={handleChange}
                                className={styles.formInput} placeholder="Tùy chọn..."
                            />
                        </div>
                        <div>
                            <label htmlFor="address" className={styles.formLabel}>Địa chỉ</label>
                            <input
                                type="text" id="address" name="address"
                                value={formData.address} onChange={handleChange}
                                className={styles.formInput} placeholder="Tùy chọn..."
                            />
                        </div>
                        <div>
                            <label htmlFor="phoneNumber" className={styles.formLabel}>Số điện thoại</label>
                            <input
                                type="text" id="phoneNumber" name="phoneNumber"
                                value={formData.phoneNumber} onChange={handleChange}
                                className={styles.formInput} placeholder="Tùy chọn..."
                            />
                        </div>


                        <div>
                            <label htmlFor="username" className={styles.formLabel}>Tên đăng nhập</label>
                            <input
                                type="text"
                                id="username"
                                name="username" // Thêm name để hàm handleChange hoạt động
                                value={formData.username}
                                onChange={handleChange}
                                className={styles.formInput}
                                placeholder="Nhập username..."
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="email" className={styles.formLabel}>Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email" // Thêm name
                                value={formData.email}
                                onChange={handleChange}
                                className={styles.formInput}
                                placeholder="Nhập email..."
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className={styles.formLabel}>Mật khẩu</label>
                            <input
                                type="password"
                                id="password"
                                name="password" // Thêm name
                                value={formData.password}
                                onChange={handleChange}
                                className={styles.formInput}
                                placeholder="Nhập password..."
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="confirmPassword" className={styles.formLabel}>Xác nhận Mật khẩu</label>
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword" // Thêm name
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className={styles.formInput}
                                placeholder="Nhập lại password..."
                                required
                            />
                        </div>
                    </div>

                    {message && (
                        // Dùng class khác nhau cho thành công và thất bại
                        <p className={isError ? styles.errorMessage : styles.successMessage}>
                            {message}
                        </p>
                    )}

                    <button type="submit" className={styles.loginButton}>
                        Đăng ký
                    </button>
                </form>
                <p className={styles.footerText}>
                    Bạn đã có tài khoản?{' '}
                    <Link to="/login" className={styles.registerLink}>
                        Đăng nhập
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default RegisterPage;