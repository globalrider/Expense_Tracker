package com.expensetracker.controller;

import com.expensetracker.dto.ExpenseDto;
import com.expensetracker.model.User;
import com.expensetracker.service.ExpenseService;
import com.expensetracker.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/v1/expenses")
@Tag(name = "Expense Management", description = "Endpoints for recording, categorizing, and tracking expenses")
public class ExpenseController {

    @Autowired
    private ExpenseService expenseService;

    @Autowired
    private UserService userService;

    @GetMapping
    @Operation(summary = "Get all expenses for the current user", description = "Fetch user's own expenses with optional filtering")
    public ResponseEntity<List<ExpenseDto>> getExpenses(
            @RequestHeader(value = "X-User-Email", required = false) String userEmail,
            @RequestHeader(value = "X-User-Id", required = false) Long userId,
            @RequestParam(required = false) String month,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {

        User user = userService.resolveUser(userEmail, userId);
        return ResponseEntity.ok(expenseService.getExpensesForUser(user, month, category, startDate, endDate));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get expense by ID", description = "Fetch single expense record belonging to the current user")
    public ResponseEntity<ExpenseDto> getExpenseById(
            @RequestHeader(value = "X-User-Email", required = false) String userEmail,
            @RequestHeader(value = "X-User-Id", required = false) Long userId,
            @PathVariable Long id) {

        User user = userService.resolveUser(userEmail, userId);
        return ResponseEntity.ok(expenseService.getExpenseById(user, id));
    }

    @PostMapping
    @Operation(summary = "Log new expense", description = "Create an expense for the current user")
    public ResponseEntity<ExpenseDto> createExpense(
            @RequestHeader(value = "X-User-Email", required = false) String userEmail,
            @RequestHeader(value = "X-User-Id", required = false) Long userId,
            @Valid @RequestBody ExpenseDto dto) {

        User user = userService.resolveUser(userEmail, userId);
        return ResponseEntity.ok(expenseService.createExpense(user, dto));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update expense", description = "Update user's existing expense record")
    public ResponseEntity<ExpenseDto> updateExpense(
            @RequestHeader(value = "X-User-Email", required = false) String userEmail,
            @RequestHeader(value = "X-User-Id", required = false) Long userId,
            @PathVariable Long id,
            @Valid @RequestBody ExpenseDto dto) {

        User user = userService.resolveUser(userEmail, userId);
        return ResponseEntity.ok(expenseService.updateExpense(user, id, dto));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete expense", description = "Remove user's expense record")
    public ResponseEntity<Void> deleteExpense(
            @RequestHeader(value = "X-User-Email", required = false) String userEmail,
            @RequestHeader(value = "X-User-Id", required = false) Long userId,
            @PathVariable Long id) {

        User user = userService.resolveUser(userEmail, userId);
        expenseService.deleteExpense(user, id);
        return ResponseEntity.noContent().build();
    }
}
