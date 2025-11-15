package com.example.anhvudemo.mapper;

import com.example.anhvudemo.dto.RegisterRequest;
import com.example.anhvudemo.dto.UserDto; // <-- Thêm import
import com.example.anhvudemo.entity.User;

public class UserMapper {

    public static User toEntity(RegisterRequest dto) {
        User user = new User();
        user.setUsername(dto.getUsername());
        user.setEmail(dto.getEmail());
        user.setPassword(dto.getPassword()); 
        user.setName(dto.getName());
        user.setAddress(dto.getAddress());
        user.setPhoneNumber(dto.getPhoneNumber());
        user.setRole("USER"); 
        return user;
    }
    public static UserDto toUserDto(User user) {
        return UserDto.builder()
                .id(user.getId()) 
                .username(user.getUsername())
                .name(user.getName())
                .email(user.getEmail())
                .address(user.getAddress())
                .phoneNumber(user.getPhoneNumber())
                .role(user.getRole())
                .build();
    }
}