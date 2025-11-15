package com.example.anhvudemo.service.impl;

import org.springframework.security.core.Authentication;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.anhvudemo.dto.LoginRequest;
import com.example.anhvudemo.dto.LoginResponse;
import com.example.anhvudemo.dto.RegisterRequest;
import com.example.anhvudemo.entity.User;
import com.example.anhvudemo.exception.ResourceNotFoundException;
import com.example.anhvudemo.repository.UserRepository;
import com.example.anhvudemo.service.JwtService;
import com.example.anhvudemo.service.UserService;

import java.util.List;
import java.util.stream.Collectors;
import com.example.anhvudemo.dto.UserDto;
import com.example.anhvudemo.dto.UserUpdateDto;
import com.example.anhvudemo.mapper.UserMapper;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    // Tên biến này là 'authManager'
    private final AuthenticationManager authManager;

    public UserServiceImpl(UserRepository userRepository, PasswordEncoder passwordEncoder,
            JwtService jwtService, AuthenticationManager authManager) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authManager = authManager;
    }

    @Override
    public LoginResponse register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already exists");
        }

        // Thêm kiểm tra email
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        User user = User.builder()
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .name(request.getName()) // Thêm name
                .email(request.getEmail())
                .address(request.getAddress()) // Thêm address
                .phoneNumber(request.getPhoneNumber()) // Thêm phone
                .role("USER") // mặc định là USER
                .build();

        userRepository.save(user);

        // SỬA 2: Tạo token
        String token = jwtService.generateToken(user.getUsername());

        // SỬA 3: Trả về LoginResponse (giống hệt hàm login)
        return new LoginResponse(token, "USER",user.getName());
    }

    @Override
    public LoginResponse login(LoginRequest request) {

        Authentication authentication = authManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(),
                        request.getPassword()));
        var userDetails = (com.example.anhvudemo.entity.User) authentication.getPrincipal();

        String token = jwtService.generateToken(userDetails.getUsername());

        // 4. Lấy role (quan trọng!)
        // Lấy role đầu tiên từ danh sách (ví dụ: "ROLE_ADMIN" hoặc "ROLE_USER")
        String role = userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .findFirst()
                .orElse("ROLE_USER"); // Mặc định nếu không tìm thấy

        // 5. Trả về đối tượng JSON
        return new LoginResponse(token, role,userDetails.getName());
    }

    @Override
    public Boolean existsByEmail(String email) {
        // Gọi thẳng phương thức tương ứng của JpaRepository
        return userRepository.existsByEmail(email);
    }

    @Override
    public List<UserDto> getAllUsers() {
        List<User> users = userRepository.findAll();
        return users.stream()
                .map(UserMapper::toUserDto)
                .collect(Collectors.toList());
    }

    @Override
    public UserDto updateUser(Long id, UserUpdateDto dto) {
        // 1. Tìm user trong DB, nếu không có ném 404
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));

        // SỬA ĐÚNG
        if (dto.getEmail() != null && !dto.getEmail().equals(user.getEmail())) {
            // 2. Chỉ kiểm tra email mới này với NHỮNG NGƯỜI KHÁC
            if (userRepository.existsByEmail(dto.getEmail())) {
                throw new RuntimeException("Email đã tồn tại (do người khác sử dụng)");
            }
            // 3. Nếu không trùng (với người khác) -> gán
            user.setEmail(dto.getEmail());
        }

        if (dto.getName() != null)
            user.setName(dto.getName());
        if (dto.getAddress() != null)
            user.setAddress(dto.getAddress());
        if (dto.getPhoneNumber() != null)
            user.setPhoneNumber(dto.getPhoneNumber());
        if (dto.getRole() != null)
            user.setRole(dto.getRole());

        User updatedUser = userRepository.save(user);
        return UserMapper.toUserDto(updatedUser);
    }

    @Override
    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new ResourceNotFoundException("User", "id", id);
        }
        userRepository.deleteById(id);
    }
}