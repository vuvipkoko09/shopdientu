package com.example.anhvudemo.mapper;

import com.example.anhvudemo.dto.CategoryDto;
import com.example.anhvudemo.entity.Category;

public class CategoryMapper {

    public static CategoryDto toDto(Category category) {
        CategoryDto dto = new CategoryDto();
        dto.setId(category.getId());
        dto.setName(category.getName());
        return dto;
    }

    public static Category toEntity(CategoryDto dto) {
        Category category = new Category();
        category.setId(dto.getId());
        category.setName(dto.getName());
        return category;
    }
}
