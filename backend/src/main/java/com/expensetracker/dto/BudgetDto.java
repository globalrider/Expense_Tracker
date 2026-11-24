package com.expensetracker.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public class BudgetDto {
    private Long id;

    @NotBlank
    private String category;

    @NotNull
    @Positive
    private Double limit;

    @NotBlank
    private String month;

    public BudgetDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public Double getLimit() { return limit; }
    public void setLimit(Double limit) { this.limit = limit; }

    public String getMonth() { return month; }
    public void setMonth(String month) { this.month = month; }
}
