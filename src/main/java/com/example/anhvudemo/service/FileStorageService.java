package com.example.anhvudemo.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;
import org.apache.commons.io.FilenameUtils; // Bạn cần thêm thư viện này vào pom.xml

@Service
public class FileStorageService {

    private final Path root; // Đường dẫn đến thư mục 'uploads'

    public FileStorageService() {
        // Đường dẫn đến thư mục 'uploads' ở gốc dự án
        this.root = Paths.get("uploads");
        try {
            if (!Files.exists(root)) {
                Files.createDirectory(root);
            }
        } catch (IOException e) {
            throw new RuntimeException("Không thể khởi tạo thư mục lưu trữ!", e);
        }
    }

    /**
     * Lưu file và trả về đường dẫn tương đối (relative path)
     */
    public String save(MultipartFile file, String type) {
        try {
            // 1. Tạo thư mục con dựa trên 'type' (ví dụ: 'uploads/products')
            Path typePath = this.root.resolve(type); // -> 'uploads/products'
            if (!Files.exists(typePath)) {
                Files.createDirectory(typePath);
            }
            
            // 2. Tạo tên file duy nhất
            String extension = FilenameUtils.getExtension(file.getOriginalFilename());
            String generatedFileName = UUID.randomUUID().toString() + "." + extension;

            // 3. Resolve đường dẫn đầy đủ
            // -> 'uploads/products/ten-file-duy-nhat.jpg'
            Path destinationFile = typePath.resolve(generatedFileName);

            // 4. Copy file vào thư mục con
            try (InputStream inputStream = file.getInputStream()) {
                Files.copy(inputStream, destinationFile, StandardCopyOption.REPLACE_EXISTING);
            }

            // 5. Trả về đường dẫn TƯƠNG ĐỐI (bao gồm cả type)
            // Ví dụ: /uploads/products/ten-file-duy-nhat.jpg
            return "/uploads/" + type + "/" + generatedFileName;

        } catch (IOException e) {
            throw new RuntimeException("Không thể lưu file.", e);
        }
    }
}