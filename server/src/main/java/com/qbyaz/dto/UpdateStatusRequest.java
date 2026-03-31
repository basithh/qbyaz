package com.qbyaz.dto;

import com.qbyaz.model.TokenStatus;
import jakarta.validation.constraints.NotNull;

public class UpdateStatusRequest {

    @NotNull(message = "Status is required")
    private TokenStatus status;

    public TokenStatus getStatus() { return status; }
    public void setStatus(TokenStatus status) { this.status = status; }
}
