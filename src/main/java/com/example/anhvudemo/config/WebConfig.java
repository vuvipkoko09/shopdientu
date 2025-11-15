package com.example.anhvudemo.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Khi trình duyệt gọi /uploads/**
        registry.addResourceHandler("/uploads/**")
                // Spring sẽ tìm file trong thư mục 'file:./uploads/' (tức là thư mục 'uploads' ở gốc dự án)
                .addResourceLocations("file:./uploads/");
    }
}