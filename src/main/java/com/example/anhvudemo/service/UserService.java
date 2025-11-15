package com.example.anhvudemo.service;

import java.util.List;

import com.example.anhvudemo.dto.LoginRequest;
import com.example.anhvudemo.dto.LoginResponse;
import com.example.anhvudemo.dto.RegisterRequest;
import com.example.anhvudemo.dto.UserDto;
import com.example.anhvudemo.dto.UserUpdateDto;

public interface UserService {
    LoginResponse register(RegisterRequest request);
    LoginResponse login(LoginRequest request);
    Boolean existsByEmail(String email);
    List<UserDto> getAllUsers();
    UserDto updateUser(Long id, UserUpdateDto dto);
    void deleteUser(Long id);
}
