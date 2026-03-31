package com.qbyaz.service;

import com.qbyaz.model.Token;

public interface NotificationService {
    void sendTokenConfirmation(Token token);
    void sendTurnNearAlert(Token token);
    void sendNowServingAlert(Token token);
}
