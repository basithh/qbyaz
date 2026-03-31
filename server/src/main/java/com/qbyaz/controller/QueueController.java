package com.qbyaz.controller;

import com.qbyaz.dto.QueueStateResponse;
import com.qbyaz.service.QueueService;
import com.qbyaz.service.SseService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

@RestController
@RequestMapping("/api/sessions")
public class QueueController {

    private final QueueService queueService;
    private final SseService sseService;

    public QueueController(QueueService queueService, SseService sseService) {
        this.queueService = queueService;
        this.sseService = sseService;
    }

    @GetMapping("/{slug}/queue")
    public ResponseEntity<QueueStateResponse> getQueueState(@PathVariable String slug) {
        return ResponseEntity.ok(queueService.getQueueState(slug));
    }

    @PostMapping("/{slug}/next")
    public ResponseEntity<QueueStateResponse> callNext(@PathVariable String slug) {
        return ResponseEntity.ok(queueService.callNext(slug));
    }

    @GetMapping("/{slug}/events")
    public SseEmitter subscribe(@PathVariable String slug) {
        // Verify session exists
        queueService.getSession(slug);

        SseEmitter emitter = sseService.subscribe(slug);

        // Send initial state
        try {
            QueueStateResponse state = queueService.getQueueState(slug);
            emitter.send(SseEmitter.event().name("init").data(state));
        } catch (Exception e) {
            emitter.completeWithError(e);
        }

        return emitter;
    }
}
