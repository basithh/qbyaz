package com.qbyaz.dto;

import jakarta.validation.constraints.NotBlank;

public class CreateSessionRequest {

    @NotBlank(message = "Session name is required")
    private String name;

    private String location;

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
}
