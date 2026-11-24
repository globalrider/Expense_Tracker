package com.expensetracker.init;

import com.expensetracker.model.Role;
import com.expensetracker.model.User;
import com.expensetracker.repository.UserRepository;
import com.expensetracker.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserService userService;

    @Override
    public void run(String... args) throws Exception {
        logger.info("Initializing Expense Tracker accounts...");

        // Ensure the single designated Administrator 'itachi' exists with the specified credentials
        Optional<User> existingItachi = userRepository.findByEmail("itachi@gmail.com");
        if (existingItachi.isEmpty()) {
            User admin = new User();
            admin.setName("itachi");
            admin.setEmail("itachi@gmail.com");
            admin.setPassword("itachi@1313");
            admin.setRole(Role.ROLE_ADMIN);
            admin.setProfession("System Administrator");
            admin.setCurrency("USD");
            admin.setAvatar("https://api.dicebear.com/7.x/avataaars/svg?seed=itachi");
            admin.setMonthlyBudgetAlertThreshold(85);
            userRepository.save(admin);
            logger.info("Designated Administrator account 'itachi' (itachi@gmail.com) created successfully.");
        } else {
            User admin = existingItachi.get();
            admin.setName("itachi");
            admin.setPassword("itachi@1313");
            admin.setRole(Role.ROLE_ADMIN);
            userRepository.save(admin);
            logger.info("Administrator account 'itachi' verified.");
        }

        // Clean up legacy demo accounts if they exist from prior seeding
        List<String> legacyDemoEmails = Arrays.asList(
                "alex@example.com",
                "emma@example.com",
                "david@example.com",
                "sophia@example.com",
                "james@example.com",
                "admin@example.com"
        );

        for (String demoEmail : legacyDemoEmails) {
            userRepository.findByEmail(demoEmail).ifPresent(u -> {
                logger.info("Removing legacy demo user account: {}", demoEmail);
                userService.deleteUser(u.getId());
            });
        }
    }
}
