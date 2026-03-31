package com.qbyaz.service;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.List;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;

@Service
public class SseService {

    private final ConcurrentHashMap<String, CopyOnWriteArrayList<SseEmitter>> clients = new ConcurrentHashMap<>();

    public SseEmitter subscribe(String slug) {
        SseEmitter emitter = new SseEmitter(0L); // no timeout
        clients.computeIfAbsent(slug, k -> new CopyOnWriteArrayList<>()).add(emitter);

        emitter.onCompletion(() -> removeEmitter(slug, emitter));
        emitter.onTimeout(() -> removeEmitter(slug, emitter));
        emitter.onError(e -> removeEmitter(slug, emitter));

        return emitter;
    }

    public void broadcast(String slug, String eventName, Object data) {
        List<SseEmitter> emitters = clients.get(slug);
        if (emitters == null) return;

        List<SseEmitter> dead = new java.util.ArrayList<>();
        for (SseEmitter emitter : emitters) {
            try {
                emitter.send(SseEmitter.event()
                        .name(eventName)
                        .data(data));
            } catch (IOException e) {
                dead.add(emitter);
            }
        }
        emitters.removeAll(dead);
    }

    @Scheduled(fixedRate = 30000)
    public void heartbeat() {
        clients.forEach((slug, emitters) -> {
            List<SseEmitter> dead = new java.util.ArrayList<>();
            for (SseEmitter emitter : emitters) {
                try {
                    emitter.send(SseEmitter.event().comment("heartbeat"));
                } catch (IOException e) {
                    dead.add(emitter);
                }
            }
            emitters.removeAll(dead);
        });
    }

    private void removeEmitter(String slug, SseEmitter emitter) {
        CopyOnWriteArrayList<SseEmitter> emitters = clients.get(slug);
        if (emitters != null) {
            emitters.remove(emitter);
            if (emitters.isEmpty()) {
                clients.remove(slug);
            }
        }
    }
}
