-- =============================================================================
-- Database Schema for Expense Tracker (MySQL 8+, MariaDB)
-- =============================================================================

DROP TABLE IF EXISTS expense_tags;
DROP TABLE IF EXISTS expenses;
DROP TABLE IF EXISTS incomes;
DROP TABLE IF EXISTS budgets;
DROP TABLE IF EXISTS users;

-- -----------------------------------------------------------------------------
-- 1. Table: users
-- -----------------------------------------------------------------------------
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'ROLE_USER',
    profession VARCHAR(100) DEFAULT 'Professional',
    currency VARCHAR(10) DEFAULT 'USD',
    avatar VARCHAR(500),
    monthly_budget_alert_threshold INT DEFAULT 80,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);

-- -----------------------------------------------------------------------------
-- 2. Table: incomes
-- -----------------------------------------------------------------------------
CREATE TABLE incomes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    source VARCHAR(100) NOT NULL,
    amount DECIMAL(12, 2) NOT NULL,
    date DATE NOT NULL,
    reference VARCHAR(100),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_incomes_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_incomes_user_date ON incomes(user_id, date);

-- -----------------------------------------------------------------------------
-- 3. Table: expenses
-- -----------------------------------------------------------------------------
CREATE TABLE expenses (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    category VARCHAR(100) NOT NULL,
    amount DECIMAL(12, 2) NOT NULL,
    date DATE NOT NULL,
    payment_method VARCHAR(50),
    description VARCHAR(255) NOT NULL,
    receipt_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_expenses_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_expenses_user_date ON expenses(user_id, date);
CREATE INDEX idx_expenses_user_category ON expenses(user_id, category);

-- -----------------------------------------------------------------------------
-- 4. Table: expense_tags
-- -----------------------------------------------------------------------------
CREATE TABLE expense_tags (
    expense_id BIGINT NOT NULL,
    tag VARCHAR(50) NOT NULL,
    PRIMARY KEY (expense_id, tag),
    CONSTRAINT fk_tags_expense FOREIGN KEY (expense_id) REFERENCES expenses(id) ON DELETE CASCADE
);

-- -----------------------------------------------------------------------------
-- 5. Table: budgets
-- -----------------------------------------------------------------------------
CREATE TABLE budgets (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    category VARCHAR(100) NOT NULL,
    budget_limit DECIMAL(12, 2) NOT NULL,
    budget_month VARCHAR(7) NOT NULL, -- Format: 'YYYY-MM'
    CONSTRAINT fk_budgets_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT uk_user_category_month UNIQUE (user_id, category, budget_month)
);

CREATE INDEX idx_budgets_user_month ON budgets(user_id, budget_month);
