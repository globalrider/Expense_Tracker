package com.expensetracker.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI expenseTrackerOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("SmartSpend - Expense Tracker REST API")
                        .description("Interactive Swagger/OpenAPI documentation for the Expense Tracker backend. " +
                                "Manage Incomes, Expenses, Category Budgets, Financial Analytics, and Transactions.")
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("Expense Tracker Team")
                                .email("contact@expensetracker.local"))
                        .license(new License()
                                .name("Apache 2.0")
                                .url("https://springdoc.org")));
    }
}
