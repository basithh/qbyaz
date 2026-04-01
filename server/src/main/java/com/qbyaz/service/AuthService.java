package com.qbyaz.service;

import com.qbyaz.model.Admin;
import com.qbyaz.repository.AdminRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final AdminRepository adminRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(AdminRepository adminRepository, PasswordEncoder passwordEncoder) {
        this.adminRepository = adminRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public Admin register(String name, String email, String password) {
        if (adminRepository.existsByEmail(email)) {
            throw new IllegalStateException("Email already registered");
        }
        Admin admin = new Admin(email, passwordEncoder.encode(password), name);
        return adminRepository.save(admin);
    }

    public Admin login(String email, String password) {
        Admin admin = adminRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Invalid email or password"));
        if (!passwordEncoder.matches(password, admin.getPassword())) {
            throw new IllegalArgumentException("Invalid email or password");
        }
        return admin;
    }
}
