import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthService from "../api/AuthService";
import styles from '../css/LoginPage.module.css';

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "username") {
      setUsername(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const { token, role ,name} = await AuthService.login(username, password);
      console.log("Login response:", { token, role, username,name});
      const expiryTime = new Date().getTime() + 60 * 60 * 1000;
      localStorage.setItem("token", token);
      localStorage.setItem("expiryTime", expiryTime);
      localStorage.setItem("user", JSON.stringify({ username, role }));
      if (role === "ADMIN") {
        navigate("/admin/dashboard");
      } else {
        navigate("/");
      }
    } catch (error) {
      setMessage("❌ Đăng nhập thất bại! Sai username hoặc password.");
      console.error(error);
    }
  };

  return (
    <div className={styles.loginContainer}> {/* Container full màn hình */}
      <div className={styles.loginFormContainer}> {/* Form trắng ở giữa */}
        <h2 className={styles.loginTitle}>🔐 Đăng nhập hệ thống</h2>
        <form onSubmit={handleLogin} className={styles.form}>
          <div>
            <label htmlFor="username" className={styles.formLabel}>Tên đăng nhập</label>
            <input
              type="text"
              id="username"
              name="username"
              value={username}
              onChange={handleChange}
              className={styles.formInput}
              placeholder="Nhập username..."
              required
            />
          </div>
          <div>
            <label htmlFor="password" className={styles.formLabel}>Mật khẩu</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={handleChange}
              className={styles.formInput}
              placeholder="Nhập password..."
              required
            />
          </div>
          {message && (
            <p className={styles.errorMessage}>{message}</p>
          )}
          <button type="submit" className={styles.loginButton}>
            Đăng nhập
          </button>
        </form>
        <p className={styles.footerText}>
          Nếu bạn chưa có tài khoản?{' '}
          <Link to="/register" className={styles.registerLink}>
            Đăng ký
          </Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
