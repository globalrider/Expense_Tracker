package com.expensetracker.controller;

import com.expensetracker.model.User;
import com.expensetracker.service.AnalyticsService;
import com.expensetracker.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/analytics")
@Tag(name = "Analytics & Reports", description = "Endpoints for financial calculations, category shares, and monthly savings summaries")
public class AnalyticsController {

    @Autowired
    private AnalyticsService analyticsService;

    @Autowired
    private UserService userService;

    @GetMapping("/summary")
    @Operation(summary = "Monthly financial summary", description = "Calculate total income, total expenses, net savings, savings rate %, remaining budget, and category breakdown for current user")
    public ResponseEntity<Map<String, Object>> getMonthlySummary(
            @RequestHeader(value = "X-User-Email", required = false) String userEmail,
            @RequestHeader(value = "X-User-Id", required = false) Long userId,
            @RequestParam(required = false) String month) {

        User user = userService.resolveUser(userEmail, userId);

        String targetMonth = (month != null && !month.isBlank())
                ? month
                : LocalDate.now().format(DateTimeFormatter.ofPattern("yyyy-MM"));

        return ResponseEntity.ok(analyticsService.getMonthlySummary(user, targetMonth));
    }
}
