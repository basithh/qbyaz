package com.qbyaz.dto;

import jakarta.validation.constraints.NotBlank;

public class CreateTokenRequest {

    @NotBlank(message = "Name is required")
    private String name;

    private String purpose;
    private String category;
    private String phone;

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getPurpose() { return purpose; }
    public void setPurpose(String purpose) { this.purpose = purpose; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
}
