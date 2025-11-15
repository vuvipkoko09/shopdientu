package com.example.anhvudemo.controller;

import java.util.HashMap;
import java.util.List;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

import com.example.anhvudemo.dto.ProductDto;
import com.example.anhvudemo.service.ProductService;
import java.util.Map;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    // Lấy tất cả sản phẩm
    @GetMapping
    public ResponseEntity<List<ProductDto>> getAllProducts() {
        return ResponseEntity.ok(productService.getAllProducts());
    }

    // Lấy sản phẩm theo id
    @GetMapping("/{id}")
    public ResponseEntity<ProductDto> getProductById(@PathVariable Integer id) {
        return ResponseEntity.ok(productService.getProductById(id));
    }

    @PostMapping
    public ResponseEntity<ProductDto> addProduct(
            // 2. THÊM @Valid VÀO ĐÂY
            @Valid @RequestBody ProductDto productDto) {
        return ResponseEntity.ok(productService.addProduct(productDto));
    }

    // Sửa hàm Cập nhật sản phẩm
    @PutMapping("/{id}")
    public ResponseEntity<ProductDto> updateProduct(
            @PathVariable Integer id,
            // 2. THÊM @Valid VÀO ĐÂY
            @Valid @RequestBody ProductDto productDto) {
        return ResponseEntity.ok(productService.updateProduct(id, productDto));
    }

    // Xoá sản phẩm
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteProduct(@PathVariable Integer id) {
        productService.deleteProduct(id);

        // Khai báo map trước
        Map<String, String> body = new HashMap<>();
        body.put("message", "Product deleted successfully");

        return ResponseEntity.ok(body); // 200 OK với message
    }
    @GetMapping("/search")
    public List<ProductDto> searchByName(@RequestParam String name) {
        return productService.searchByName(name);
    }

    // 🔎 Tìm theo khoảng giá
    @GetMapping("/price")
    public List<ProductDto> searchByPrice(
            @RequestParam Double min,
            @RequestParam Double max) {
        return productService.searchByPriceRange(min, max);
    }

    // 🔎 Tìm theo danh mục
    @GetMapping("/category/{id}")
    public List<ProductDto> searchByCategory(@PathVariable Long id) {
        return productService.searchByCategory(id);
    }
}
