package com.expensetracker.model;

import jakarta.persistence.*;

@Entity
@Table(name = "budgets", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"user_id", "category", "budget_month"})
})
public class Budget {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String category;

    @Column(name = "budget_limit", nullable = false)
    private Double limit;

    // Use explicit column name 'budget_month' to avoid SQL reserved keyword 'MONTH'
    @Column(name = "budget_month", nullable = false)
    private String month; // Format: "YYYY-MM" (e.g. "2026-11")

    public Budget() {}

    public Budget(User user, String category, Double limit, String month) {
        this.user = user;
        this.category = category;
        this.limit = limit;
        this.month = month;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public Double getLimit() { return limit; }
    public void setLimit(Double limit) { this.limit = limit; }

    public String getMonth() { return month; }
    public void setMonth(String month) { this.month = month; }
}
