package com.expensetracker.controller;

import com.expensetracker.dto.UserDto;
import com.expensetracker.model.User;
import com.expensetracker.repository.UserRepository;
import com.expensetracker.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/admin")
@Tag(name = "Admin User Management", description = "Endpoints for administrator user directory and user management")
public class AdminController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserService userService;

    @GetMapping("/users")
    @Operation(summary = "List all users", description = "Retrieve who the users are in the system")
    public ResponseEntity<List<UserDto>> getAllUsers() {
        List<UserDto> users = userRepository.findAll().stream().map(this::toDto).collect(Collectors.toList());
        return ResponseEntity.ok(users);
    }

    @GetMapping("/stats")
    @Operation(summary = "User statistics", description = "Summary of total users, standard users, and administrators")
    public ResponseEntity<Map<String, Object>> getSystemStats() {
        List<User> allUsers = userRepository.findAll();
        long totalUsers = allUsers.size();
        long adminCount = allUsers.stream().filter(u -> u.getRole().name().equals("ROLE_ADMIN")).count();
        long userCount = totalUsers - adminCount;

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUsers", totalUsers);
        stats.put("userCount", userCount);
        stats.put("adminCount", adminCount);
        return ResponseEntity.ok(stats);
    }

    @PostMapping("/users")
    @Operation(summary = "Create user", description = "Create a new user as administrator")
    public ResponseEntity<UserDto> createUser(@Valid @RequestBody UserDto dto) {
        User created = userService.createUser(dto, "password123");
        return ResponseEntity.ok(toDto(created));
    }

    @PutMapping("/users/{id}")
    @Operation(summary = "Update user", description = "Update user details, profession, or role")
    public ResponseEntity<UserDto> updateUser(@PathVariable Long id, @RequestBody UserDto dto) {
        User updated = userService.updateUser(id, dto);
        return ResponseEntity.ok(toDto(updated));
    }

    @DeleteMapping("/users/{id}")
    @Operation(summary = "Delete user", description = "Remove user and their financial records")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    private UserDto toDto(User user) {
        UserDto dto = new UserDto();
        dto.setId(user.getId());
        dto.setName(user.getName());
        dto.setEmail(user.getEmail());
        dto.setRole(user.getRole().name());
        dto.setProfession(user.getProfession());
        dto.setCurrency(user.getCurrency());
        dto.setAvatar(user.getAvatar());
        dto.setMonthlyBudgetAlertThreshold(user.getMonthlyBudgetAlertThreshold());
        return dto;
    }
}
