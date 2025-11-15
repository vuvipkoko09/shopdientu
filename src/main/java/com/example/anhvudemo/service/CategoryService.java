package com.example.anhvudemo.service;

import com.example.anhvudemo.dto.CategoryDto;
import java.util.List;

public interface CategoryService {
    CategoryDto addCategory(CategoryDto categoryDto);
    List<CategoryDto> getAllCategories();
    CategoryDto getCategoryById(Integer id);
    CategoryDto updateCategory(Integer id, CategoryDto categoryDto);
    void deleteCategory(Integer id);
    List<CategoryDto> searchByName(String keyword);
}
