package com.example.anhvudemo.service.impl;

import com.example.anhvudemo.dto.ProductDto;
import com.example.anhvudemo.entity.Product;
import com.example.anhvudemo.exception.ResourceNotFoundException;
import com.example.anhvudemo.mapper.ProductMapper;
import com.example.anhvudemo.repository.ProductRepository;
import com.example.anhvudemo.service.ProductService;
import com.example.anhvudemo.entity.Category;
import com.example.anhvudemo.repository.CategoryRepository;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.Objects;

@Service
@Transactional
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    public ProductServiceImpl(ProductRepository productRepository, CategoryRepository categoryRepository) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
    }

    @Override
    public ProductDto addProduct(ProductDto productDto) {
        // 1. Chuyển đổi các trường đơn giản
        Product product = ProductMapper.toEntity(productDto);

        // 2. Xử lý logic quan hệ (Category)
        if (productDto.getCategoryId() != null) {
            Category category = categoryRepository.findById(productDto.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Category not found with id: " + productDto.getCategoryId()));
            product.setCategory(category);
        }

        // 3. Lưu vào DB
        Product saved = productRepository.save(product);

        // 4. Trả về DTO
        return ProductMapper.toDto(saved);
    }

    @Override
    public List<ProductDto> getAllProducts() {
        return productRepository.findAllWithCategory()
                .stream()
                .map(ProductMapper::toDto) // Giống như (product) -> ProductMapper.toDto(product)
                .collect(Collectors.toList());
    }

    @Override
    public ProductDto getProductById(Integer id) {
        Product p = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
        return ProductMapper.toDto(p);
    }

    @Override
    public ProductDto updateProduct(Integer id, ProductDto productDto) {
        // 1. Tìm sản phẩm hiện có
        Product existing = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));

        // 2. Cập nhật các trường đơn giản
        existing.setName(productDto.getName());
        existing.setDescription(productDto.getDescription());
        existing.setPrice(productDto.getPrice());
        existing.setQuantity(productDto.getQuantity());
        existing.setImageUrl(productDto.getImageUrl()); // <-- Thêm trường còn thiếu

        // 3. Xử lý logic cập nhật Category (chỉ khi categoryId thay đổi)
        if (productDto.getCategoryId() != null) {
            // Kiểm tra xem category có bị thay đổi không
            if (existing.getCategory() == null
                    || !Objects.equals(existing.getCategory().getId(), productDto.getCategoryId())) {
                Category category = categoryRepository.findById(productDto.getCategoryId())
                        .orElseThrow(() -> new ResourceNotFoundException(
                                "Category not found with id: " + productDto.getCategoryId()));
                existing.setCategory(category);
            }
        } else {
            existing.setCategory(null); // Cho phép gỡ bỏ Category
        }

        // 4. Lưu và trả về DTO
        return ProductMapper.toDto(productRepository.save(existing));
    }

    @Override
    public void deleteProduct(Integer id) {
        if (!productRepository.existsById(id)) {
            throw new ResourceNotFoundException("Product not found with id: " + id);
        }
        productRepository.deleteById(id);
    }

    // === SỬA CÁC HÀM TÌM KIẾM ===

    @Override
    public List<ProductDto> searchByName(String name) {
        // Trả về List<ProductDto>
        return productRepository.findByNameContainingIgnoreCase(name)
                .stream()
                .map(ProductMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<ProductDto> searchByPriceRange(Double min, Double max) {
        // Trả về List<ProductDto>
        return productRepository.findByPriceBetween(min, max)
                .stream()
                .map(ProductMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<ProductDto> searchByCategory(Long categoryId) {
        // Trả về List<ProductDto>
        return productRepository.findByCategoryId(categoryId)
                .stream()
                .map(ProductMapper::toDto)
                .collect(Collectors.toList());
    }
}
