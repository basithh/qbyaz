package com.qbyaz.controller;

import com.qbyaz.dto.CreateTokenRequest;
import com.qbyaz.dto.TokenResponse;
import com.qbyaz.dto.UpdateStatusRequest;
import com.qbyaz.model.Token;
import com.qbyaz.model.TokenStatus;
import com.qbyaz.service.QueueService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class TokenController {

    private final QueueService queueService;

    public TokenController(QueueService queueService) {
        this.queueService = queueService;
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
            @RequestParam(required = false) TokenStatus status) {
        List<Token> tokens = queueService.getTokens(slug, status);
        return ResponseEntity.ok(tokens.stream().map(TokenResponse::from).toList());
    }

    @PatchMapping("/tokens/{id}/status")
    public ResponseEntity<TokenResponse> updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdateStatusRequest request) {
        Token token = queueService.updateTokenStatus(id, request.getStatus());
        return ResponseEntity.ok(TokenResponse.from(token));
    }
}
