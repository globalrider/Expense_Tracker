package com.expensetracker.controller;

import com.expensetracker.dto.BudgetDto;
import com.expensetracker.model.User;
import com.expensetracker.service.BudgetService;
import com.expensetracker.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/budgets")
@Tag(name = "Budget Management", description = "Endpoints for configuring and tracking monthly category spending limits")
public class BudgetController {

    @Autowired
    private BudgetService budgetService;

    @Autowired
    private UserService userService;

    @GetMapping
    @Operation(summary = "Get user budgets", description = "Fetch current user's budgets or filter by month (e.g. 2026-11)")
    public ResponseEntity<List<BudgetDto>> getBudgets(
            @RequestHeader(value = "X-User-Email", required = false) String userEmail,
            @RequestHeader(value = "X-User-Id", required = false) Long userId,
            @RequestParam(required = false) String month) {

        User user = userService.resolveUser(userEmail, userId);
        return ResponseEntity.ok(budgetService.getBudgetsForUser(user, month));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get budget by ID", description = "Fetch a single budget cap by ID for current user")
    public ResponseEntity<BudgetDto> getBudgetById(
            @RequestHeader(value = "X-User-Email", required = false) String userEmail,
            @RequestHeader(value = "X-User-Id", required = false) Long userId,
            @PathVariable Long id) {

        User user = userService.resolveUser(userEmail, userId);
        return ResponseEntity.ok(budgetService.getBudgetById(user, id));
    }

    @PostMapping
    @Operation(summary = "Set or update budget", description = "Set monthly spending limit for current user")
    public ResponseEntity<BudgetDto> setBudget(
            @RequestHeader(value = "X-User-Email", required = false) String userEmail,
            @RequestHeader(value = "X-User-Id", required = false) Long userId,
            @Valid @RequestBody BudgetDto dto) {

        User user = userService.resolveUser(userEmail, userId);
        return ResponseEntity.ok(budgetService.setBudget(user, dto));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete budget limit", description = "Remove budget spending limit by ID for current user")
    public ResponseEntity<Void> deleteBudget(
            @RequestHeader(value = "X-User-Email", required = false) String userEmail,
            @RequestHeader(value = "X-User-Id", required = false) Long userId,
            @PathVariable Long id) {

        User user = userService.resolveUser(userEmail, userId);
        budgetService.deleteBudget(user, id);
        return ResponseEntity.noContent().build();
    }
}
