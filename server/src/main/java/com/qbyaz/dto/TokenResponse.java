package com.qbyaz.dto;

import com.qbyaz.model.Token;
import com.qbyaz.model.TokenStatus;
import java.time.LocalDateTime;

public class TokenResponse {
    private Long id;
    private Integer tokenNumber;
    private String name;
    private String purpose;
    private String category;
    private String phone;
    private TokenStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static TokenResponse from(Token token) {
        TokenResponse r = new TokenResponse();
        r.id = token.getId();
        r.tokenNumber = token.getTokenNumber();
        r.name = token.getName();
        r.purpose = token.getPurpose();
        r.category = token.getCategory();
        r.phone = token.getPhone();
        r.status = token.getStatus();
        r.createdAt = token.getCreatedAt();
        r.updatedAt = token.getUpdatedAt();
        return r;
    }

    public Long getId() { return id; }
    public Integer getTokenNumber() { return tokenNumber; }
    public String getName() { return name; }
    public String getPurpose() { return purpose; }
    public String getCategory() { return category; }
    public String getPhone() { return phone; }
    public TokenStatus getStatus() { return status; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
}
