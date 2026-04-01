package com.qbyaz.controller;

import com.qbyaz.config.JwtUtil;
import com.qbyaz.dto.AuthResponse;
import com.qbyaz.dto.LoginRequest;
import com.qbyaz.dto.RegisterRequest;
import com.qbyaz.model.Admin;
import com.qbyaz.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final JwtUtil jwtUtil;

    public AuthController(AuthService authService, JwtUtil jwtUtil) {
        this.authService = authService;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        Admin admin = authService.register(request.getName(), request.getEmail(), request.getPassword());
        String token = jwtUtil.generateToken(admin.getId(), admin.getEmail());
        return ResponseEntity.ok(new AuthResponse(token, admin.getName(), admin.getEmail()));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        Admin admin = authService.login(request.getEmail(), request.getPassword());
        String token = jwtUtil.generateToken(admin.getId(), admin.getEmail());
        return ResponseEntity.ok(new AuthResponse(token, admin.getName(), admin.getEmail()));
    }
}
