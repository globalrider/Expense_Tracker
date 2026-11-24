package com.expensetracker.service;

import com.expensetracker.dto.UserDto;
import com.expensetracker.model.Role;
import com.expensetracker.model.User;
import com.expensetracker.repository.BudgetRepository;
import com.expensetracker.repository.ExpenseRepository;
import com.expensetracker.repository.IncomeRepository;
import com.expensetracker.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private IncomeRepository incomeRepository;

    @Autowired
    private ExpenseRepository expenseRepository;

    @Autowired
    private BudgetRepository budgetRepository;

    public User resolveUser(String email, Long id) {
        if (email != null && !email.isBlank()) {
            Optional<User> byEmail = userRepository.findByEmail(email.trim().toLowerCase());
            if (byEmail.isPresent()) return byEmail.get();
        }
        if (id != null) {
            Optional<User> byId = userRepository.findById(id);
            if (byId.isPresent()) return byId.get();
        }
        return getDefaultUser();
    }

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email.trim().toLowerCase())
                .orElseGet(this::getDefaultUser);
    }

    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseGet(this::getDefaultUser);
    }

    public User getDefaultUser() {
        Optional<User> first = userRepository.findAll().stream().findFirst();
        return first.orElseGet(() -> {
            User fallback = new User();
            fallback.setName("itachi");
            fallback.setEmail("itachi@gmail.com");
            fallback.setPassword("itachi@1313");
            fallback.setProfession("System Administrator");
            fallback.setRole(Role.ROLE_ADMIN);
            return userRepository.save(fallback);
        });
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User createUser(UserDto dto, String password) {
        if (userRepository.existsByEmail(dto.getEmail().trim().toLowerCase())) {
            throw new IllegalArgumentException("User with email " + dto.getEmail() + " already exists.");
        }
        User user = new User();
        user.setName(dto.getName().trim());
        user.setEmail(dto.getEmail().trim().toLowerCase());
        user.setPassword(password != null && !password.isBlank() ? password : "password123");
        user.setRole("ROLE_ADMIN".equalsIgnoreCase(dto.getRole()) ? Role.ROLE_ADMIN : Role.ROLE_USER);
        user.setProfession(dto.getProfession() != null && !dto.getProfession().isBlank()
                ? dto.getProfession().trim()
                : "Professional");
        user.setCurrency(dto.getCurrency() != null ? dto.getCurrency() : "USD");
        user.setAvatar(dto.getAvatar() != null && !dto.getAvatar().isBlank()
                ? dto.getAvatar()
                : "https://api.dicebear.com/7.x/avataaars/svg?seed=" + dto.getName());
        user.setMonthlyBudgetAlertThreshold(dto.getMonthlyBudgetAlertThreshold() != null ? dto.getMonthlyBudgetAlertThreshold() : 80);
        return userRepository.save(user);
    }

    public User updateUser(Long id, UserDto dto) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));

        if (dto.getName() != null) user.setName(dto.getName().trim());
        if (dto.getRole() != null) {
            user.setRole("ROLE_ADMIN".equalsIgnoreCase(dto.getRole()) ? Role.ROLE_ADMIN : Role.ROLE_USER);
        }
        if (dto.getProfession() != null) user.setProfession(dto.getProfession().trim());
        if (dto.getCurrency() != null) user.setCurrency(dto.getCurrency());
        if (dto.getMonthlyBudgetAlertThreshold() != null) user.setMonthlyBudgetAlertThreshold(dto.getMonthlyBudgetAlertThreshold());
        if (dto.getAvatar() != null) user.setAvatar(dto.getAvatar().trim());

        return userRepository.save(user);
    }

    @Transactional
    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));

        budgetRepository.deleteByUser(user);
        expenseRepository.deleteByUser(user);
        incomeRepository.deleteByUser(user);
        userRepository.delete(user);
    }
}
