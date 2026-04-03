package com.qbyaz.service;

import com.qbyaz.dto.QueueStateResponse;
import com.qbyaz.dto.SessionResponse;
import com.qbyaz.dto.TokenResponse;
import com.qbyaz.model.Admin;
import com.qbyaz.model.Session;
import com.qbyaz.model.SessionStatus;
import com.qbyaz.model.Token;
import com.qbyaz.model.TokenStatus;
import com.qbyaz.repository.SessionRepository;
import com.qbyaz.repository.TokenRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.util.List;

@Service
public class QueueService {

    private static final String SLUG_CHARS = "abcdefghijklmnopqrstuvwxyz0123456789";
    private static final int SLUG_LENGTH = 8;
    private static final SecureRandom random = new SecureRandom();

    private final SessionRepository sessionRepository;
    private final TokenRepository tokenRepository;
    private final SseService sseService;
    private final NotificationService notificationService;

    public QueueService(SessionRepository sessionRepository, TokenRepository tokenRepository,
                        SseService sseService, NotificationService notificationService) {
        this.sessionRepository = sessionRepository;
        this.tokenRepository = tokenRepository;
        this.sseService = sseService;
        this.notificationService = notificationService;
    }

    public Session createSession(String name, String location, Admin admin) {
        Session session = new Session(name, location, generateSlug());
        session.setAdmin(admin);
        return sessionRepository.save(session);
    }

    public List<SessionResponse> getAdminSessions(Admin admin) {
        List<Session> sessions = sessionRepository.findByAdminOrderByCreatedAtDesc(admin);
        return sessions.stream().map(session -> {
            long waiting = tokenRepository.countBySessionIdAndStatus(session.getId(), TokenStatus.PENDING);
            long served = tokenRepository.countBySessionIdAndStatus(session.getId(), TokenStatus.COMPLETED);
            return SessionResponse.from(session, waiting, served);
        }).toList();
    }

    public Session getSession(String slug) {
        return sessionRepository.findBySlug(slug)
                .orElseThrow(() -> new IllegalArgumentException("Session not found"));
    }

    @Transactional
    public Session closeSession(String slug) {
        Session session = getSession(slug);
        session.setStatus(SessionStatus.CLOSED);
        session = sessionRepository.save(session);
        sseService.broadcast(slug, "session_closed", buildQueueState(session));
        return session;
    }

    @Transactional
    public synchronized Token createToken(String slug, String name, String purpose, String category, String phone) {
        Session session = getSession(slug);
        if (session.getStatus() != SessionStatus.ACTIVE) {
            throw new IllegalStateException("Session is closed");
        }

        Integer maxNumber = tokenRepository.findMaxTokenNumber(session.getId());
        int nextNumber = maxNumber + 1;

        Token token = new Token();
        token.setSession(session);
        token.setTokenNumber(nextNumber);
        token.setName(name);
        token.setPurpose(purpose);
        token.setCategory(category != null && !category.isBlank() ? category : "general");
        token.setPhone(phone);
        token = tokenRepository.save(token);

        notificationService.sendTokenConfirmation(token);

        // Notify next-in-line customers
        notifyUpcoming(session);

        sseService.broadcast(slug, "queue_updated", buildQueueState(session));
        return token;
    }

    @Transactional
    public Token updateTokenStatus(Long tokenId, TokenStatus newStatus) {
        Token token = tokenRepository.findById(tokenId)
                .orElseThrow(() -> new IllegalArgumentException("Token not found"));
        token.setStatus(newStatus);
        token = tokenRepository.save(token);

        String slug = token.getSession().getSlug();
        Session session = token.getSession();

        if (newStatus == TokenStatus.IN_PROGRESS) {
            notificationService.sendNowServingAlert(token);
        }

        sseService.broadcast(slug, "queue_updated", buildQueueState(session));
        return token;
    }

    @Transactional
    public QueueStateResponse callNext(String slug) {
        Session session = getSession(slug);

        // Complete current in-progress token
        tokenRepository.findFirstBySessionIdAndStatusOrderByTokenNumberAsc(session.getId(), TokenStatus.IN_PROGRESS)
                .ifPresent(current -> {
                    current.setStatus(TokenStatus.COMPLETED);
                    tokenRepository.save(current);
                });

        // Get next pending
        Token next = tokenRepository.findFirstBySessionIdAndStatusOrderByTokenNumberAsc(session.getId(), TokenStatus.PENDING)
                .orElse(null);

        if (next != null) {
            next.setStatus(TokenStatus.IN_PROGRESS);
            tokenRepository.save(next);
            notificationService.sendNowServingAlert(next);
        }

        // Notify upcoming customers
        notifyUpcoming(session);

        QueueStateResponse state = buildQueueState(session);
        sseService.broadcast(slug, "queue_updated", state);
        return state;
    }

    public QueueStateResponse getQueueState(String slug) {
        Session session = getSession(slug);
        return buildQueueState(session);
    }

    public List<Token> getTokens(String slug, TokenStatus status) {
        Session session = getSession(slug);
        if (status != null) {
            return tokenRepository.findBySessionIdAndStatusOrderByTokenNumberAsc(session.getId(), status);
        }
        return tokenRepository.findBySessionIdOrderByTokenNumberAsc(session.getId());
    }

    private QueueStateResponse buildQueueState(Session session) {
        QueueStateResponse state = new QueueStateResponse();
        state.setSessionName(session.getName());
        state.setSessionLocation(session.getLocation());
        state.setSessionStatus(session.getStatus().name());

        tokenRepository.findFirstBySessionIdAndStatusOrderByTokenNumberAsc(session.getId(), TokenStatus.IN_PROGRESS)
                .ifPresent(t -> state.setCurrentlyServing(TokenResponse.from(t)));

        List<Token> pending = tokenRepository.findBySessionIdAndStatusOrderByTokenNumberAsc(session.getId(), TokenStatus.PENDING);
        state.setPending(pending.stream().map(TokenResponse::from).toList());

        List<Token> completed = tokenRepository.findBySessionIdAndStatusOrderByTokenNumberAsc(session.getId(), TokenStatus.COMPLETED);
        state.setCompleted(completed.stream().map(TokenResponse::from).toList());

        state.setTotalServed(completed.size());
        state.setTotalWaiting(pending.size());
        return state;
    }

    private void notifyUpcoming(Session session) {
        List<Token> pending = tokenRepository.findBySessionIdAndStatusOrderByTokenNumberAsc(session.getId(), TokenStatus.PENDING);
        // Notify the next 2 people that their turn is near
        pending.stream().limit(2).forEach(notificationService::sendTurnNearAlert);
    }

    private String generateSlug() {
        StringBuilder sb = new StringBuilder(SLUG_LENGTH);
        for (int i = 0; i < SLUG_LENGTH; i++) {
            sb.append(SLUG_CHARS.charAt(random.nextInt(SLUG_CHARS.length())));
        }
        return sb.toString();
    }
}
