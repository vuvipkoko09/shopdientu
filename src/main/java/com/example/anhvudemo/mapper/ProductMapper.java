package com.example.anhvudemo.mapper;

import com.example.anhvudemo.dto.ProductDto;
import com.example.anhvudemo.entity.Product;

public class ProductMapper {
    public static ProductDto toDto(Product product) {
        if (product == null) {
            return null;
        }
        return ProductDto.builder()
                .id(product.getId())
                .name(product.getName())
                .description(product.getDescription())
                .price(product.getPrice())
                .quantity(product.getQuantity())
                .imageUrl(product.getImageUrl())
                .categoryId(product.getCategory() != null ? product.getCategory().getId() : null)
                .build();
    }


    public static Product toEntity(ProductDto productDto) {
        if (productDto == null) {
            return null;
        }
        return Product.builder()
                .id(productDto.getId()) 
                .name(productDto.getName())
                .description(productDto.getDescription())
                .price(productDto.getPrice())
                .quantity(productDto.getQuantity())
                .imageUrl(productDto.getImageUrl())
                .build();
    }
}

