package com.example.anhvudemo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.anhvudemo.entity.Category;

import java.util.List;

public interface CategoryRepository extends JpaRepository<Category, Integer> {
    List<Category> findByNameContainingIgnoreCase(String keyword);
}
