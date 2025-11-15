package com.example.anhvudemo.exception;

import java.util.HashMap;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError; // <-- Thêm import
import org.springframework.web.bind.MethodArgumentNotValidException; // <-- Thêm import
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus; // <-- Thêm import
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    /**
     * ✅ HÀM MỚI: Bắt lỗi validation (400 Bad Request)
     * Hàm này được kích hoạt khi một tham số có @Valid bị lỗi.
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST) // Trả về lỗi 400
    public ResponseEntity<Map<String, String>> handleValidationExceptions(
            MethodArgumentNotValidException ex) {
        
        Map<String, String> errors = new HashMap<>();
        
        // Lặp qua tất cả các lỗi và gán chúng vào Map
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField(); // Lấy tên trường (ví dụ: "name")
            String errorMessage = error.getDefaultMessage(); // Lấy message (ví dụ: "Tên không được trống")
            errors.put(fieldName, errorMessage);
        });
        
        // Trả về JSON, ví dụ: { "name": "Tên không được trống", "price": "Giá phải lớn hơn 0" }
        return ResponseEntity.badRequest().body(errors);
    }

    /**
     * HÀM CŨ CỦA BẠN: Bắt lỗi 404 Not Found (Rất tốt)
     */
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<Map<String, String>> handleNotFound(ResourceNotFoundException ex) {
        Map<String, String> body = new HashMap<>();
        body.put("error", ex.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(body);
    }

    /**
     * HÀM CŨ CỦA BẠN: Bắt tất cả các lỗi khác (500 Server Error)
     * (Nên đặt hàm này ở cuối cùng)
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, String>> handleAll(Exception ex) {
        Map<String, String> body = new HashMap<>();
        body.put("error", "Lỗi máy chủ nội bộ: " + ex.getMessage());
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(body);
    }
}