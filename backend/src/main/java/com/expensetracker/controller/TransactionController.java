package com.expensetracker.controller;

import com.expensetracker.dto.ExpenseDto;
import com.expensetracker.dto.IncomeDto;
import com.expensetracker.model.User;
import com.expensetracker.service.ExpenseService;
import com.expensetracker.service.IncomeService;
import com.expensetracker.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.*;

@RestController
@RequestMapping("/api/v1/transactions")
@Tag(name = "Transaction Timeline", description = "Endpoints for fetching unified chronological timeline feeds of incomes and expenses")
public class TransactionController {

    @Autowired
    private IncomeService incomeService;

    @Autowired
    private ExpenseService expenseService;

    @Autowired
    private UserService userService;

    @GetMapping
    @Operation(summary = "Get combined transaction feed", description = "Fetch combined incomes and expenses sorted by date descending for current user")
    public ResponseEntity<List<Map<String, Object>>> getCombinedTransactions(
            @RequestHeader(value = "X-User-Email", required = false) String userEmail,
            @RequestHeader(value = "X-User-Id", required = false) Long userId,
            @RequestParam(required = false) String month,
            @RequestParam(defaultValue = "20") int limit) {

        User user = userService.resolveUser(userEmail, userId);

        List<IncomeDto> incomes = incomeService.getIncomesForUser(user, month, null, null, null);
        List<ExpenseDto> expenses = expenseService.getExpensesForUser(user, month, null, null, null);

        List<Map<String, Object>> feed = new ArrayList<>();

        for (IncomeDto inc : incomes) {
            Map<String, Object> map = new HashMap<>();
            map.put("id", "inc-" + inc.getId());
            map.put("rawId", inc.getId());
            map.put("type", "INCOME");
            map.put("title", inc.getSource());
            map.put("amount", inc.getAmount());
            map.put("date", inc.getDate());
            map.put("reference", inc.getReference());
            map.put("notes", inc.getNotes());
            feed.add(map);
        }

        for (ExpenseDto exp : expenses) {
            Map<String, Object> map = new HashMap<>();
            map.put("id", "exp-" + exp.getId());
            map.put("rawId", exp.getId());
            map.put("type", "EXPENSE");
            map.put("title", exp.getDescription());
            map.put("category", exp.getCategory());
            map.put("amount", exp.getAmount());
            map.put("date", exp.getDate());
            map.put("paymentMethod", exp.getPaymentMethod());
            map.put("tags", exp.getTags());
            feed.add(map);
        }

        // Sort descending by date
        feed.sort((a, b) -> {
            LocalDate dateA = (LocalDate) a.get("date");
            LocalDate dateB = (LocalDate) b.get("date");
            return dateB.compareTo(dateA);
        });

        if (feed.size() > limit) {
            feed = feed.subList(0, limit);
        }

        return ResponseEntity.ok(feed);
    }
}
