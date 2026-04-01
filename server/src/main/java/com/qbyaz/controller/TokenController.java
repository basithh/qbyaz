package com.qbyaz.controller;

import com.qbyaz.dto.CreateTokenRequest;
import com.qbyaz.dto.TokenResponse;
import com.qbyaz.dto.UpdateStatusRequest;
import com.qbyaz.model.Admin;
import com.qbyaz.model.Session;
import com.qbyaz.model.Token;
import com.qbyaz.model.TokenStatus;
import com.qbyaz.repository.AdminRepository;
import com.qbyaz.repository.TokenRepository;
import com.qbyaz.service.QueueService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class TokenController {

    private final QueueService queueService;
    private final AdminRepository adminRepository;
    private final TokenRepository tokenRepository;

    public TokenController(QueueService queueService, AdminRepository adminRepository, TokenRepository tokenRepository) {
        this.queueService = queueService;
        this.adminRepository = adminRepository;
        this.tokenRepository = tokenRepository;
    }

    @PostMapping("/sessions/{slug}/tokens")
    public ResponseEntity<TokenResponse> createToken(
            @PathVariable String slug,
            @Valid @RequestBody CreateTokenRequest request) {
        Token token = queueService.createToken(
                slug, request.getName(), request.getPurpose(),
                request.getCategory(), request.getPhone());
        return ResponseEntity.ok(TokenResponse.from(token));
    }

    @GetMapping("/sessions/{slug}/tokens")
    public ResponseEntity<List<TokenResponse>> getTokens(
            @PathVariable String slug,
            @RequestParam(required = false) TokenStatus status,
            Authentication authentication) {
        Admin admin = getAdmin(authentication);
        Session session = queueService.getSession(slug);
        verifyOwnership(session, admin);
        List<Token> tokens = queueService.getTokens(slug, status);
        return ResponseEntity.ok(tokens.stream().map(TokenResponse::from).toList());
    }

    @PatchMapping("/tokens/{id}/status")
    public ResponseEntity<TokenResponse> updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdateStatusRequest request,
            Authentication authentication) {
        Admin admin = getAdmin(authentication);
        Token token = tokenRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Token not found"));
        verifyOwnership(token.getSession(), admin);
        token = queueService.updateTokenStatus(id, request.getStatus());
        return ResponseEntity.ok(TokenResponse.from(token));
    }

    private Admin getAdmin(Authentication authentication) {
        Long adminId = (Long) authentication.getPrincipal();
        return adminRepository.findById(adminId)
                .orElseThrow(() -> new IllegalArgumentException("Admin not found"));
    }

    private void verifyOwnership(Session session, Admin admin) {
        if (session.getAdmin() == null || !session.getAdmin().getId().equals(admin.getId())) {
            throw new SecurityException("You don't have permission to manage this session");
        }
    }
}
