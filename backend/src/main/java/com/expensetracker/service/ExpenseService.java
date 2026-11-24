package com.expensetracker.service;

import com.expensetracker.dto.ExpenseDto;
import com.expensetracker.model.Expense;
import com.expensetracker.model.User;
import com.expensetracker.repository.ExpenseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ExpenseService {

    @Autowired
    private ExpenseRepository expenseRepository;

    // Fetch all expenses with optional filters (month or category or date range)
    public List<ExpenseDto> getExpensesForUser(User user, String month, String category, LocalDate startDate, LocalDate endDate) {
        List<Expense> list;

        if (month != null && !month.isBlank()) {
            String[] parts = month.split("-");
            int year = Integer.parseInt(parts[0]);
            int monthNum = Integer.parseInt(parts[1]);
            LocalDate start = LocalDate.of(year, monthNum, 1);
            LocalDate end = start.plusMonths(1).minusDays(1);
            list = expenseRepository.findByUserAndDateBetweenOrderByDateDesc(user, start, end);
        } else if (startDate != null && endDate != null) {
            list = expenseRepository.findByUserAndDateBetweenOrderByDateDesc(user, startDate, endDate);
        } else if (category != null && !category.isBlank() && !"ALL".equalsIgnoreCase(category)) {
            list = expenseRepository.findByUserAndCategoryOrderByDateDesc(user, category);
        } else {
            list = expenseRepository.findByUserOrderByDateDesc(user);
        }

        return list.stream().map(this::toDto).collect(Collectors.toList());
    }

    // Fetch single expense record by ID
    public ExpenseDto getExpenseById(User user, Long id) {
        Expense expense = expenseRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new RuntimeException("Expense record not found with id: " + id));
        return toDto(expense);
    }

    // Create new expense record
    public ExpenseDto createExpense(User user, ExpenseDto dto) {
        Expense expense = new Expense();
        expense.setUser(user);
        expense.setCategory(dto.getCategory());
        expense.setAmount(dto.getAmount());
        expense.setDate(dto.getDate());
        expense.setPaymentMethod(dto.getPaymentMethod());
        expense.setDescription(dto.getDescription());
        expense.setReceiptUrl(dto.getReceiptUrl());
        expense.setTags(dto.getTags());

        Expense saved = expenseRepository.save(expense);
        return toDto(saved);
    }

    // Update expense record
    public ExpenseDto updateExpense(User user, Long id, ExpenseDto dto) {
        Expense expense = expenseRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new RuntimeException("Expense not found or unauthorized"));

        expense.setCategory(dto.getCategory());
        expense.setAmount(dto.getAmount());
        expense.setDate(dto.getDate());
        expense.setPaymentMethod(dto.getPaymentMethod());
        expense.setDescription(dto.getDescription());
        expense.setReceiptUrl(dto.getReceiptUrl());
        expense.setTags(dto.getTags());

        return toDto(expenseRepository.save(expense));
    }

    // Delete expense record
    public void deleteExpense(User user, Long id) {
        Expense expense = expenseRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new RuntimeException("Expense not found or unauthorized"));
        expenseRepository.delete(expense);
    }

    public ExpenseDto toDto(Expense expense) {
        ExpenseDto dto = new ExpenseDto();
        dto.setId(expense.getId());
        dto.setCategory(expense.getCategory());
        dto.setAmount(expense.getAmount());
        dto.setDate(expense.getDate());
        dto.setPaymentMethod(expense.getPaymentMethod());
        dto.setDescription(expense.getDescription());
        dto.setReceiptUrl(expense.getReceiptUrl());
        dto.setTags(expense.getTags());
        return dto;
    }
}
