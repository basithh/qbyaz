package com.qbyaz.dto;

import java.util.List;

public class QueueStateResponse {
    private String sessionName;
    private String sessionLocation;
    private String sessionStatus;
    private TokenResponse currentlyServing;
    private List<TokenResponse> pending;
    private List<TokenResponse> completed;
    private long totalServed;
    private long totalWaiting;

    public String getSessionName() { return sessionName; }
    public void setSessionName(String sessionName) { this.sessionName = sessionName; }

    public String getSessionLocation() { return sessionLocation; }
    public void setSessionLocation(String sessionLocation) { this.sessionLocation = sessionLocation; }

    public String getSessionStatus() { return sessionStatus; }
    public void setSessionStatus(String sessionStatus) { this.sessionStatus = sessionStatus; }

    public TokenResponse getCurrentlyServing() { return currentlyServing; }
    public void setCurrentlyServing(TokenResponse currentlyServing) { this.currentlyServing = currentlyServing; }

    public List<TokenResponse> getPending() { return pending; }
    public void setPending(List<TokenResponse> pending) { this.pending = pending; }

    public List<TokenResponse> getCompleted() { return completed; }
    public void setCompleted(List<TokenResponse> completed) { this.completed = completed; }

    public long getTotalServed() { return totalServed; }
    public void setTotalServed(long totalServed) { this.totalServed = totalServed; }

    public long getTotalWaiting() { return totalWaiting; }
    public void setTotalWaiting(long totalWaiting) { this.totalWaiting = totalWaiting; }
}
