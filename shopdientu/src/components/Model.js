import React from "react";
import { X } from "lucide-react"; // Icon nút X

/**
 * Component Modal
 * @param {boolean} isOpen - State để mở/đóng modal
 * @param {function} onClose - Hàm để gọi khi đóng modal
 * @param {string} title - Tiêu đề của modal
 * @param {React.ReactNode} children - Nội dung bên trong modal (chính là cái form)
 */
function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) {
    return null; // Nếu không mở, không render gì cả
  }

  return (
    // Lớp phủ nền mờ
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        zIndex: 40,
      }}
      onClick={onClose} // Bấm ra ngoài để đóng
    >
      {/* Khung nội dung của Modal */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          backgroundColor: "white",
          padding: "24px",
          borderRadius: "8px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          width: "90%",
          maxWidth: "500px", // Giới hạn chiều rộng
          zIndex: 50,
        }}
        onClick={(e) => e.stopPropagation()} // Ngăn việc bấm bên trong modal cũng đóng modal
      >
        {/* Header của Modal (Tiêu đề và nút X) */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "16px",
          }}
        >
          <h3 style={{ fontSize: "1.25rem", fontWeight: "600" }}>{title}</h3>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "4px",
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Nội dung (chính là ProductForm) */}
        <div>{children}</div>
      </div>
    </div>
  );
}

export default Modal;
