package com.qbyaz.dto;

import com.qbyaz.model.Session;
import com.qbyaz.model.SessionStatus;
import java.time.LocalDateTime;

public class SessionResponse {
    private Long id;
    private String name;
    private String location;
    private String slug;
    private SessionStatus status;
    private LocalDateTime createdAt;

    public static SessionResponse from(Session session) {
        SessionResponse r = new SessionResponse();
        r.id = session.getId();
        r.name = session.getName();
        r.location = session.getLocation();
        r.slug = session.getSlug();
        r.status = session.getStatus();
        r.createdAt = session.getCreatedAt();
        return r;
    }

    public Long getId() { return id; }
    public String getName() { return name; }
    public String getLocation() { return location; }
    public String getSlug() { return slug; }
    public SessionStatus getStatus() { return status; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}
