package com.example.anhvudemo.entity;

// THÊM CÁC IMPORT NÀY
import java.util.Collection;
import java.util.List;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
// ---
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "users") // Đặt tên bảng cho rõ ràng
// THÊM "implements UserDetails"
public class User implements UserDetails {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String username;
    private String password;
    private String name;
    private String email;
    private String role; // Ví dụ: "ADMIN" hoặc "USER"
    private String address;
    private String phoneNumber;

    // ----- CÁC HÀM MỚI BẮT BUỘC CỦA UserDetails -----

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // Tự động chuyển "ADMIN" thành "ROLE_ADMIN" cho Spring Security
        return List.of(new SimpleGrantedAuthority(this.role));
    }

    @Override
    public boolean isAccountNonExpired() {
        return true; // Mặc định là true
    }

    @Override
    public boolean isAccountNonLocked() {
        return true; // Mặc định là true
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true; // Mặc định là true
    }

    @Override
    public boolean isEnabled() {
        return true; // Mặc định là true
    }
}