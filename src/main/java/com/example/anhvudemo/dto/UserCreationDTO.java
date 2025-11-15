package com.example.anhvudemo.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserCreationDTO {
    @NotBlank(message = "Username không được để trống")
    @Size(min = 3, max = 20, message = "Username phải từ 3 đến 20 ký tự")
    private String username;

    @NotBlank(message = "Password không được để trống")
    @Size(min = 6, message = "Password phải ít nhất 6 ký tự")
    private String password;

    @NotBlank(message = "Role không được để trống")
    @Pattern(regexp = "ADMIN|USER", message = "Role chỉ được là ADMIN hoặc USER")
    private String role;
}