package com.example.anhvudemo.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CategoryDto {

    private Integer id;

    @NotNull(message = "Tên danh mục không được để trống")
    @NotBlank(message = "Tên danh mục không được để trống")
    @Size(min = 3, max = 50, message = "Tên danh mục phải từ 3 đến 50 ký tự")
    private String name;
}
