package com.example.anhvudemo.repository;

import com.example.anhvudemo.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Integer> {
    List<Product> findByNameContainingIgnoreCase(String name);
    List<Product> findByPriceBetween(Double min, Double max);
    List<Product> findByCategoryId(Long categoryId);
    @Query("SELECT p FROM Product p LEFT JOIN FETCH p.category")
    List<Product> findAllWithCategory();
}
