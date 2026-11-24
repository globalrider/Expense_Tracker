package com.expensetracker.controller;

import com.expensetracker.dto.AuthRequest;
import com.expensetracker.dto.AuthResponse;
import com.expensetracker.dto.RegisterRequest;
import com.expensetracker.dto.UserDto;
import com.expensetracker.model.Role;
import com.expensetracker.model.User;
import com.expensetracker.repository.UserRepository;
import com.expensetracker.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserService userService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody AuthRequest request) {
        Optional<User> userOpt = userRepository.findByEmail(request.getEmail().trim().toLowerCase());

        if (userOpt.isEmpty() || !userOpt.get().getPassword().equals(request.getPassword())) {
            return ResponseEntity.status(401).body(Map.of("message", "Invalid email or password"));
        }

        User user = userOpt.get();

        // Enforce strict administrator validation when logging in as ADMIN
        if ("ROLE_ADMIN".equalsIgnoreCase(request.getExpectedRole()) || "ADMIN".equalsIgnoreCase(request.getExpectedRole())) {
            if (user.getRole() != Role.ROLE_ADMIN) {
                return ResponseEntity.status(403).body(Map.of("message", "Access denied: Account does not have administrator privileges."));
            }
            if (request.getUsername() != null && !request.getUsername().isBlank()
                    && !user.getName().equalsIgnoreCase(request.getUsername().trim())) {
                return ResponseEntity.status(401).body(Map.of("message", "Access denied: Invalid administrator username."));
            }
        }

        String token = "jwt_token_" + user.getId() + "_" + System.currentTimeMillis();
        String refreshToken = "refresh_" + System.currentTimeMillis();

        return ResponseEntity.ok(new AuthResponse(token, refreshToken, toUserDto(user)));
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail().trim().toLowerCase())) {
            return ResponseEntity.badRequest().body(Map.of("message", "An account with this email already exists"));
        }

        User user = new User();
        user.setName(request.getName().trim());
        user.setEmail(request.getEmail().trim().toLowerCase());
        user.setPassword(request.getPassword());

        // When creating new account, ONLY standard user can be created (no public admin creation)
        user.setRole(Role.ROLE_USER);

        user.setProfession(request.getProfession() != null && !request.getProfession().isBlank()
                ? request.getProfession().trim()
                : "Professional");

        user.setCurrency(request.getCurrency() != null ? request.getCurrency() : "USD");

        user.setAvatar(request.getAvatar() != null && !request.getAvatar().isBlank()
                ? request.getAvatar().trim()
                : "https://api.dicebear.com/7.x/avataaars/svg?seed=" + request.getName());

        User savedUser = userRepository.save(user);
        String token = "jwt_token_" + savedUser.getId() + "_" + System.currentTimeMillis();
        String refreshToken = "refresh_" + System.currentTimeMillis();

        return ResponseEntity.ok(new AuthResponse(token, refreshToken, toUserDto(savedUser)));
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(
            @RequestHeader(value = "X-User-Email", required = false) String email,
            @RequestHeader(value = "X-User-Id", required = false) Long userId) {
        User user = userService.resolveUser(email, userId);
        return ResponseEntity.ok(toUserDto(user));
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(
            @RequestHeader(value = "X-User-Email", required = false) String email,
            @RequestHeader(value = "X-User-Id", required = false) Long userId,
            @RequestBody UserDto dto) {
        User user = userService.resolveUser(email, userId);
        if (dto.getCurrency() != null && !dto.getCurrency().isBlank()) {
            user.setCurrency(dto.getCurrency().trim().toUpperCase());
        }
        if (dto.getName() != null && !dto.getName().isBlank()) {
            user.setName(dto.getName().trim());
        }
        if (dto.getProfession() != null && !dto.getProfession().isBlank()) {
            user.setProfession(dto.getProfession().trim());
        }
        if (dto.getAvatar() != null && !dto.getAvatar().isBlank()) {
            user.setAvatar(dto.getAvatar().trim());
        }
        if (dto.getMonthlyBudgetAlertThreshold() != null) {
            user.setMonthlyBudgetAlertThreshold(dto.getMonthlyBudgetAlertThreshold());
        }
        User saved = userRepository.save(user);
        return ResponseEntity.ok(toUserDto(saved));
    }

    private UserDto toUserDto(User user) {
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
