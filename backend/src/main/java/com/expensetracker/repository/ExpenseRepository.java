package com.expensetracker.repository;

import com.expensetracker.model.Expense;
import com.expensetracker.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface ExpenseRepository extends JpaRepository<Expense, Long> {

    // Fetch all expenses for a user, newest first
    List<Expense> findByUserOrderByDateDesc(User user);

    // Fetch single expense record belonging to a specific user
    Optional<Expense> findByIdAndUser(Long id, User user);

    // Fetch expenses within a date range
    List<Expense> findByUserAndDateBetweenOrderByDateDesc(User user, LocalDate startDate, LocalDate endDate);

    // Fetch expenses filtered by category (e.g. Food & Dining)
    List<Expense> findByUserAndCategoryOrderByDateDesc(User user, String category);

    // Fetch expenses filtered by payment method
    List<Expense> findByUserAndPaymentMethodOrderByDateDesc(User user, String paymentMethod);

    // Delete all expenses belonging to a user
    void deleteByUser(User user);
}
