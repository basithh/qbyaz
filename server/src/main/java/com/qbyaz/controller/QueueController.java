package com.qbyaz.controller;

import com.qbyaz.dto.QueueStateResponse;
import com.qbyaz.model.Admin;
import com.qbyaz.model.Session;
import com.qbyaz.repository.AdminRepository;
import com.qbyaz.service.QueueService;
import com.qbyaz.service.SseService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

@RestController
@RequestMapping("/api/sessions")
public class QueueController {

    private final QueueService queueService;
    private final SseService sseService;
    private final AdminRepository adminRepository;

    public QueueController(QueueService queueService, SseService sseService, AdminRepository adminRepository) {
        this.queueService = queueService;
        this.sseService = sseService;
        this.adminRepository = adminRepository;
    }

    @GetMapping("/{slug}/queue")
    public ResponseEntity<QueueStateResponse> getQueueState(@PathVariable String slug) {
        return ResponseEntity.ok(queueService.getQueueState(slug));
    }

    @PostMapping("/{slug}/next")
    public ResponseEntity<QueueStateResponse> callNext(@PathVariable String slug, Authentication authentication) {
        Admin admin = getAdmin(authentication);
        Session session = queueService.getSession(slug);
        verifyOwnership(session, admin);
        return ResponseEntity.ok(queueService.callNext(slug));
    }

    @GetMapping("/{slug}/events")
    public SseEmitter subscribe(@PathVariable String slug) {
        queueService.getSession(slug);

        SseEmitter emitter = sseService.subscribe(slug);

        try {
            QueueStateResponse state = queueService.getQueueState(slug);
            emitter.send(SseEmitter.event().name("init").data(state));
        } catch (Exception e) {
            emitter.completeWithError(e);
        }

        return emitter;
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
