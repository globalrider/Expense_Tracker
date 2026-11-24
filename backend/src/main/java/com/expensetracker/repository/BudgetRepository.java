package com.expensetracker.repository;

import com.expensetracker.model.Budget;
import com.expensetracker.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BudgetRepository extends JpaRepository<Budget, Long> {

    // Fetch all budgets configured by user
    List<Budget> findByUser(User user);

    // Fetch single budget record by id and user
    Optional<Budget> findByIdAndUser(Long id, User user);

    // Fetch budgets for a specific month (e.g. "2026-11")
    List<Budget> findByUserAndMonth(User user, String month);

    // Fetch specific category budget for a month
    Optional<Budget> findByUserAndCategoryAndMonth(User user, String category, String month);

    // Delete all budgets belonging to a user
    void deleteByUser(User user);
}
