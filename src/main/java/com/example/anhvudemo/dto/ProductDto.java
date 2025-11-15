package com.example.anhvudemo.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotEmpty;
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
public class ProductDto {

    private Integer id;
    @NotEmpty(message = "Tên sản phẩm không được để trống")
    @Size(min = 3, max = 255, message = "Tên sản phẩm phải từ 3 đến 255 ký tự")
    private String name;

    private String description; 

    @NotNull(message = "Giá không được để trống")
    @Min(value = 1, message = "Giá phải lớn hơn 0")
    private Double price;

    @NotNull(message = "Số lượng không được để trống")
    @Min(value = 0, message = "Số lượng không được âm")
    private Integer quantity;

    @NotEmpty(message = "Ảnh sản phẩm không được để trống")
    private String imageUrl;

    @NotNull(message = "Danh mục không được để trống")
    private Integer categoryId;
}

