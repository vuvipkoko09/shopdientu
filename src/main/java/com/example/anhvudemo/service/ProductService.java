package com.example.anhvudemo.service;

import com.example.anhvudemo.dto.ProductDto;
import java.util.List;

public interface ProductService {
    ProductDto addProduct(ProductDto productDto);
    List<ProductDto> getAllProducts();
    ProductDto getProductById(Integer id);
    ProductDto updateProduct(Integer id, ProductDto productDto);
    void deleteProduct(Integer id);
    List<ProductDto> searchByName(String name);
    List<ProductDto> searchByPriceRange(Double min, Double max);
    List<ProductDto> searchByCategory(Long categoryId);

}