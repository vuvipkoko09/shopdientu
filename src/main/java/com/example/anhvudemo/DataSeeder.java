package com.example.anhvudemo;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.example.anhvudemo.entity.Category;
import com.example.anhvudemo.entity.Product;
import com.example.anhvudemo.repository.CategoryRepository;
import com.example.anhvudemo.repository.ProductRepository;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;

    @Override
    public void run(String... args) throws Exception {
        if (categoryRepository.count() == 0 && productRepository.count() == 0) {

            // 🧱 Tạo Category
            Category phone = new Category();
            phone.setName("Điện thoại");
            categoryRepository.save(phone);

            Category laptop = new Category();
            laptop.setName("Laptop");
            categoryRepository.save(laptop);

            Category accessory = new Category();
            accessory.setName("Phụ kiện");
            categoryRepository.save(accessory);

            // 📱 Sản phẩm thuộc danh mục "Điện thoại"
            productRepository.save(Product.builder()
                    .name("iPhone 15 Pro Max")
                    .description("Flagship Apple 2024, chip A17 Pro, camera 48MP")
                    .price(32999.0)
                    .quantity(15)
                    .category(phone)
                    .build());

            productRepository.save(Product.builder()
                    .name("Samsung Galaxy S24 Ultra")
                    .description("Màn hình AMOLED 120Hz, camera 200MP, chip Snapdragon 8 Gen 3")
                    .price(28999.0)
                    .quantity(20)
                    .category(phone)
                    .build());

            productRepository.save(Product.builder()
                    .name("Xiaomi 14 Ultra")
                    .description("Camera Leica, sạc nhanh 120W, pin 5000mAh")
                    .price(19999.0)
                    .quantity(25)
                    .category(phone)
                    .build());

            // 💻 Sản phẩm thuộc danh mục "Laptop"
            productRepository.save(Product.builder()
                    .name("MacBook Air M3")
                    .description("Chip Apple M3, 8GB RAM, SSD 512GB")
                    .price(28999.0)
                    .quantity(10)
                    .category(laptop)
                    .build());

            productRepository.save(Product.builder()
                    .name("ASUS ROG Zephyrus G14")
                    .description("Ryzen 9, RTX 4070, RAM 16GB, SSD 1TB")
                    .price(35999.0)
                    .quantity(8)
                    .category(laptop)
                    .build());

            // 🎧 Sản phẩm thuộc danh mục "Phụ kiện"
            productRepository.save(Product.builder()
                    .name("Tai nghe AirPods Pro 2")
                    .description("Chống ồn chủ động, sạc MagSafe")
                    .price(5999.0)
                    .quantity(40)
                    .category(accessory)
                    .build());

            productRepository.save(Product.builder()
                    .name("Sạc nhanh Anker 45W")
                    .description("Sạc nhanh USB-C PD, tương thích iPhone và Android")
                    .price(999.0)
                    .quantity(60)
                    .category(accessory)
                    .build());

            System.out.println("✅ Đã seed dữ liệu mẫu thành công!");
        } else {
            System.out.println("⚠️ Dữ liệu đã tồn tại, bỏ qua seeding.");
        }
    }
}
