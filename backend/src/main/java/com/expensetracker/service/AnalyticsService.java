package com.expensetracker.service;

import com.expensetracker.model.Budget;
import com.expensetracker.model.Expense;
import com.expensetracker.model.Income;
import com.expensetracker.model.User;
import com.expensetracker.repository.BudgetRepository;
import com.expensetracker.repository.ExpenseRepository;
import com.expensetracker.repository.IncomeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;

@Service
public class AnalyticsService {

    @Autowired
    private IncomeRepository incomeRepository;

    @Autowired
    private ExpenseRepository expenseRepository;

    @Autowired
    private BudgetRepository budgetRepository;

    public Map<String, Object> getMonthlySummary(User user, String month) {
        String[] parts = month.split("-");
        int year = Integer.parseInt(parts[0]);
        int monthNum = Integer.parseInt(parts[1]);

        LocalDate start = LocalDate.of(year, monthNum, 1);
        LocalDate end = start.plusMonths(1).minusDays(1);

        List<Income> incomes = incomeRepository.findByUserAndDateBetweenOrderByDateDesc(user, start, end);
        List<Expense> expenses = expenseRepository.findByUserAndDateBetweenOrderByDateDesc(user, start, end);
        List<Budget> budgets = budgetRepository.findByUserAndMonth(user, month);

        double totalIncome = incomes.stream().mapToDouble(Income::getAmount).sum();
        double totalExpense = expenses.stream().mapToDouble(Expense::getAmount).sum();
        double netSavings = totalIncome - totalExpense;
        double savingsRate = totalIncome > 0 ? Math.round((netSavings / totalIncome) * 100.0) : 0.0;
        double totalBudget = budgets.stream().mapToDouble(Budget::getLimit).sum();
        double budgetUtilization = totalBudget > 0 ? Math.round((totalExpense / totalBudget) * 100.0) : 0.0;

        // Category breakdown
        Map<String, Double> categoryTotals = new HashMap<>();
        for (Expense exp : expenses) {
            categoryTotals.put(exp.getCategory(), categoryTotals.getOrDefault(exp.getCategory(), 0.0) + exp.getAmount());
        }

        List<Map<String, Object>> categoryBreakdown = new ArrayList<>();
        for (Map.Entry<String, Double> entry : categoryTotals.entrySet()) {
            Map<String, Object> item = new HashMap<>();
            item.put("category", entry.getKey());
            item.put("amount", entry.getValue());
            item.put("percentage", totalExpense > 0 ? Math.round((entry.getValue() / totalExpense) * 100.0) : 0.0);
            categoryBreakdown.add(item);
        }

        Map<String, Object> summary = new HashMap<>();
        summary.put("month", month);
        summary.put("totalIncome", totalIncome);
        summary.put("totalExpenses", totalExpense);
        summary.put("netSavings", netSavings);
        summary.put("savingsRate", savingsRate);
        summary.put("totalBudget", totalBudget);
        summary.put("remainingBudget", totalBudget - totalExpense);
        summary.put("budgetUsedPercentage", budgetUtilization);
        summary.put("categoryBreakdown", categoryBreakdown);

        return summary;
    }
}
