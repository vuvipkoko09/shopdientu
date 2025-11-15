package com.example.anhvudemo.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.anhvudemo.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
    Boolean existsByEmailAndIdNot(String email, Long id);
    Optional<User> findByEmail(String email);
}