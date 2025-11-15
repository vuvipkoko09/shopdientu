package com.example.anhvudemo.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.Map;
import com.example.anhvudemo.service.FileStorageService;

@RestController
@RequestMapping("/api")
public class FileStorageController {

    private final FileStorageService storageService;

    public FileStorageController(FileStorageService storageService) {
        this.storageService = storageService;
    }

    // API endpoint để upload file
    @PostMapping("/upload")
    public ResponseEntity<?> uploadFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam("type") String type // <-- THÊM THAM SỐ NÀY
    ) {
        try {
            // 1. Lưu file với type
            String filePath = storageService.save(file, type); // Ví dụ: /uploads/products/abc.jpg

            // 2. Trả về đường dẫn (filePath) cho React
            return ResponseEntity.ok(Map.of("filePath", filePath));
            
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Upload file thất bại: " + e.getMessage());
        }
    }
}