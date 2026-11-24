package com.expensetracker.controller;

import com.expensetracker.dto.IncomeDto;
import com.expensetracker.model.User;
import com.expensetracker.service.IncomeService;
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
@RequestMapping("/api/v1/incomes")
@Tag(name = "Income Management", description = "Endpoints for managing user incomes, salary, freelance, and earnings")
public class IncomeController {

    @Autowired
    private IncomeService incomeService;

    @Autowired
    private UserService userService;

    @GetMapping
    @Operation(summary = "Get all incomes for current user", description = "Fetch current user's income records with optional filtering")
    public ResponseEntity<List<IncomeDto>> getIncomes(
            @RequestHeader(value = "X-User-Email", required = false) String userEmail,
            @RequestHeader(value = "X-User-Id", required = false) Long userId,
            @RequestParam(required = false) String month,
            @RequestParam(required = false) String source,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {

        User user = userService.resolveUser(userEmail, userId);
        return ResponseEntity.ok(incomeService.getIncomesForUser(user, month, source, startDate, endDate));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get income by ID", description = "Fetch single income record belonging to current user")
    public ResponseEntity<IncomeDto> getIncomeById(
            @RequestHeader(value = "X-User-Email", required = false) String userEmail,
            @RequestHeader(value = "X-User-Id", required = false) Long userId,
            @PathVariable Long id) {

        User user = userService.resolveUser(userEmail, userId);
        return ResponseEntity.ok(incomeService.getIncomeById(user, id));
    }

    @PostMapping
    @Operation(summary = "Create income record", description = "Add a new income entry for current user")
    public ResponseEntity<IncomeDto> createIncome(
            @RequestHeader(value = "X-User-Email", required = false) String userEmail,
            @RequestHeader(value = "X-User-Id", required = false) Long userId,
            @Valid @RequestBody IncomeDto dto) {

        User user = userService.resolveUser(userEmail, userId);
        return ResponseEntity.ok(incomeService.createIncome(user, dto));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update income record", description = "Update user's existing income record by ID")
    public ResponseEntity<IncomeDto> updateIncome(
            @RequestHeader(value = "X-User-Email", required = false) String userEmail,
            @RequestHeader(value = "X-User-Id", required = false) Long userId,
            @PathVariable Long id,
            @Valid @RequestBody IncomeDto dto) {

        User user = userService.resolveUser(userEmail, userId);
        return ResponseEntity.ok(incomeService.updateIncome(user, id, dto));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete income record", description = "Remove user's income record by ID")
    public ResponseEntity<Void> deleteIncome(
            @RequestHeader(value = "X-User-Email", required = false) String userEmail,
            @RequestHeader(value = "X-User-Id", required = false) Long userId,
            @PathVariable Long id) {

        User user = userService.resolveUser(userEmail, userId);
        incomeService.deleteIncome(user, id);
        return ResponseEntity.noContent().build();
    }
}
