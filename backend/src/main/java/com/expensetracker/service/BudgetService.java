package com.expensetracker.service;

import com.expensetracker.dto.BudgetDto;
import com.expensetracker.model.Budget;
import com.expensetracker.model.User;
import com.expensetracker.repository.BudgetRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class BudgetService {

    @Autowired
    private BudgetRepository budgetRepository;

    // Fetch all budgets or by month
    public List<BudgetDto> getBudgetsForUser(User user, String month) {
        List<Budget> list;
        if (month != null && !month.isBlank()) {
            list = budgetRepository.findByUserAndMonth(user, month);
        } else {
            list = budgetRepository.findByUser(user);
        }
        return list.stream().map(this::toDto).collect(Collectors.toList());
    }

    // Fetch single budget by ID
    public BudgetDto getBudgetById(User user, Long id) {
        Budget budget = budgetRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new RuntimeException("Budget limit not found with id: " + id));
        return toDto(budget);
    }

    // Set or update a budget limit
    public BudgetDto setBudget(User user, BudgetDto dto) {
        Optional<Budget> existing = budgetRepository.findByUserAndCategoryAndMonth(
                user, dto.getCategory(), dto.getMonth()
        );

        Budget budget;
        if (existing.isPresent()) {
            budget = existing.get();
            budget.setLimit(dto.getLimit());
        } else {
            budget = new Budget(user, dto.getCategory(), dto.getLimit(), dto.getMonth());
        }

        Budget saved = budgetRepository.save(budget);
        return toDto(saved);
    }

    // Delete budget limit
    public void deleteBudget(User user, Long id) {
        Budget budget = budgetRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new RuntimeException("Budget not found or unauthorized"));
        budgetRepository.delete(budget);
    }

    public BudgetDto toDto(Budget budget) {
        BudgetDto dto = new BudgetDto();
        dto.setId(budget.getId());
        dto.setCategory(budget.getCategory());
        dto.setLimit(budget.getLimit());
        dto.setMonth(budget.getMonth());
        return dto;
    }
}
