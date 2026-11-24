package com.expensetracker.dto;

public class UserDto {
    private Long id;
    private String name;
    private String email;
    private String role;
    private String profession;
    private String currency;
    private String avatar;
    private Integer monthlyBudgetAlertThreshold;

    public UserDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getProfession() { return profession; }
    public void setProfession(String profession) { this.profession = profession; }

    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }

    public String getAvatar() { return avatar; }
    public void setAvatar(String avatar) { this.avatar = avatar; }

    public Integer getMonthlyBudgetAlertThreshold() { return monthlyBudgetAlertThreshold; }
    public void setMonthlyBudgetAlertThreshold(Integer monthlyBudgetAlertThreshold) { this.monthlyBudgetAlertThreshold = monthlyBudgetAlertThreshold; }
}
