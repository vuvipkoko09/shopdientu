import { useEffect } from "react";


export function useAutoLogout() {
  useEffect(() => {
    const interval = setInterval(() => {
      const expiryTime = localStorage.getItem("expiryTime");
      if (expiryTime && new Date().getTime() >= expiryTime) {
        alert("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại.");
        localStorage.removeItem("token");
        localStorage.removeItem("expiryTime");
        window.location.href = "/login";
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);
}
