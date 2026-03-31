package com.qbyaz.service;

import com.qbyaz.model.Token;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class ConsoleNotificationService implements NotificationService {

    private static final Logger log = LoggerFactory.getLogger(ConsoleNotificationService.class);

    @Override
    public void sendTokenConfirmation(Token token) {
        if (token.getPhone() == null || token.getPhone().isBlank()) return;
        log.info("[WhatsApp] Token #{} confirmed for {} (phone: {})",
                token.getTokenNumber(), token.getName(), token.getPhone());
    }

    @Override
    public void sendTurnNearAlert(Token token) {
        if (token.getPhone() == null || token.getPhone().isBlank()) return;
        log.info("[WhatsApp] Your turn is near! Token #{} - {} (phone: {})",
                token.getTokenNumber(), token.getName(), token.getPhone());
    }

    @Override
    public void sendNowServingAlert(Token token) {
        if (token.getPhone() == null || token.getPhone().isBlank()) return;
        log.info("[WhatsApp] Now serving Token #{} - {} (phone: {})",
                token.getTokenNumber(), token.getName(), token.getPhone());
    }
}
