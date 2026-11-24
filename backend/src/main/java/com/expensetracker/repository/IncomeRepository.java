package com.expensetracker.repository;

import com.expensetracker.model.Income;
import com.expensetracker.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface IncomeRepository extends JpaRepository<Income, Long> {
    
    // Fetch all incomes for a user, newest first
    List<Income> findByUserOrderByDateDesc(User user);
    
    // Fetch single income record belonging to a specific user
    Optional<Income> findByIdAndUser(Long id, User user);

    // Fetch incomes within a date range
    List<Income> findByUserAndDateBetweenOrderByDateDesc(User user, LocalDate startDate, LocalDate endDate);

    // Fetch incomes filtered by source (e.g. Salary, Freelance)
    List<Income> findByUserAndSourceOrderByDateDesc(User user, String source);

    // Delete all incomes belonging to a user
    void deleteByUser(User user);
}
