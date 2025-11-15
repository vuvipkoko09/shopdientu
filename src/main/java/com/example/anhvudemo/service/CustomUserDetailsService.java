package com.example.anhvudemo.service;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.example.anhvudemo.entity.User;
import com.example.anhvudemo.repository.UserRepository;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // TÌM USER TỪ DATABASE
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));
        
        // TRẢ VỀ CHÍNH XÁC ĐỐI TƯỢNG 'User' (ENTITY) CỦA BẠN
        // (Thay vì 'new org.springframework.security.core.userdetails.User(...)')
        return user; 
    }
}