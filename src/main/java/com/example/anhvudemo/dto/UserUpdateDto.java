package com.example.anhvudemo.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UserUpdateDto {

    @NotBlank(message = "Họ và tên không được để trống")
    @Size(min = 2, max = 50, message = "Họ và tên phải từ 2 đến 50 ký tự")
    private String name;

    @NotBlank(message = "Email không được để trống")
    @Email(message = "Email không hợp lệ")
    private String email;

    @NotBlank(message = "Địa chỉ không được để trống")
    @Size(min = 5, max = 100, message = "Địa chỉ phải từ 5 đến 100 ký tự")
    private String address;

    @NotBlank(message = "Số điện thoại không được để trống")
    @Pattern(regexp = "0\\d{8,11}", message = "Số điện thoại phải bắt đầu bằng 0 và từ 9 đến 12 chữ số")
    private String phoneNumber;

    // Nếu user không được phép cập nhật role, có thể bỏ validate hoặc để optional
    @Pattern(regexp = "ADMIN|USER", message = "Role chỉ được là ADMIN hoặc USER")
    private String role;
}
