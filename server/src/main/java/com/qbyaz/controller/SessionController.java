package com.qbyaz.controller;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.WriterException;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import com.qbyaz.dto.CreateSessionRequest;
import com.qbyaz.dto.SessionResponse;
import com.qbyaz.model.Admin;
import com.qbyaz.model.Session;
import com.qbyaz.repository.AdminRepository;
import com.qbyaz.service.QueueService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayOutputStream;
import java.io.IOException;

@RestController
@RequestMapping("/api/sessions")
public class SessionController {

    private final QueueService queueService;
    private final AdminRepository adminRepository;

    @Value("${app.client-url}")
    private String clientUrl;

    public SessionController(QueueService queueService, AdminRepository adminRepository) {
        this.queueService = queueService;
        this.adminRepository = adminRepository;
    }

    @PostMapping
    public ResponseEntity<SessionResponse> createSession(
            @Valid @RequestBody CreateSessionRequest request,
            Authentication authentication) {
        Admin admin = getAdmin(authentication);
        Session session = queueService.createSession(request.getName(), request.getLocation(), admin);
        return ResponseEntity.ok(SessionResponse.from(session));
    }

    @GetMapping("/{slug}")
    public ResponseEntity<SessionResponse> getSession(@PathVariable String slug) {
        Session session = queueService.getSession(slug);
        return ResponseEntity.ok(SessionResponse.from(session));
    }

    @PostMapping("/{slug}/close")
    public ResponseEntity<SessionResponse> closeSession(@PathVariable String slug, Authentication authentication) {
        Admin admin = getAdmin(authentication);
        Session session = queueService.getSession(slug);
        verifyOwnership(session, admin);
        session = queueService.closeSession(slug);
        return ResponseEntity.ok(SessionResponse.from(session));
    }

    @GetMapping(value = "/{slug}/qr", produces = MediaType.IMAGE_PNG_VALUE)
    public ResponseEntity<byte[]> getQrCode(@PathVariable String slug) throws WriterException, IOException {
        queueService.getSession(slug);

        String url = clientUrl + "/join/" + slug;
        QRCodeWriter writer = new QRCodeWriter();
        BitMatrix matrix = writer.encode(url, BarcodeFormat.QR_CODE, 400, 400);

        ByteArrayOutputStream out = new ByteArrayOutputStream();
        MatrixToImageWriter.writeToStream(matrix, "PNG", out);

        return ResponseEntity.ok()
                .contentType(MediaType.IMAGE_PNG)
                .body(out.toByteArray());
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
