package com.example.anhvudemo.service.impl;

import com.example.anhvudemo.dto.CategoryDto;
import com.example.anhvudemo.entity.Category;
import com.example.anhvudemo.exception.ResourceNotFoundException;
import com.example.anhvudemo.mapper.CategoryMapper;
import com.example.anhvudemo.repository.CategoryRepository;
import com.example.anhvudemo.service.CategoryService;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;

    public CategoryServiceImpl(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    @Override
    public CategoryDto addCategory(CategoryDto categoryDto) {
        Category saved = categoryRepository.save(CategoryMapper.toEntity(categoryDto));
        return CategoryMapper.toDto(saved);
    }

    @Override
    public List<CategoryDto> getAllCategories() {
        return categoryRepository.findAll().stream().map(CategoryMapper::toDto).collect(Collectors.toList());
    }

    @Override
    public CategoryDto getCategoryById(Integer id) {
        Category c = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id));
        return CategoryMapper.toDto(c);
    }

    @Override
    public CategoryDto updateCategory(Integer id, CategoryDto categoryDto) {
        Category existing = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id));
        existing.setName(categoryDto.getName());
        return CategoryMapper.toDto(categoryRepository.save(existing));
    }

    @Override
    public void deleteCategory(Integer id) {
        if (!categoryRepository.existsById(id)) {
            throw new ResourceNotFoundException("Category not found with id: " + id);
        }
        categoryRepository.deleteById(id);
    }

    @Override
    public List<CategoryDto> searchByName(String keyword) {
        return categoryRepository.findByNameContainingIgnoreCase(keyword).stream()
                .map(CategoryMapper::toDto)
                .collect(Collectors.toList());
    }
}
