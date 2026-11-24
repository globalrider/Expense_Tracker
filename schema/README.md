# 🗄️ Expense Tracker Database Schema & Seed Data

This folder contains the complete SQL DDL definitions and initial seed records for the Expense Tracker.
Configured for **MySQL 8+** (also compatible with PostgreSQL 14+ and MariaDB).

---

## 📄 Files Overview

1. **`schema.sql`**: Table creation scripts (DDL) with primary keys, foreign key constraints, unique constraints, and optimized indexes.
2. **`data.sql`**: Initial sample records (DML) including users, demo incomes, categorized expenses, tags, and category budgets.

---

## 📊 Database ER Model Overview

```
 +--------------------+       1:N       +---------------------+
 |       users        | <-------------> |       incomes       |
 +--------------------+                 +---------------------+
 | id (PK)            |                 | id (PK)             |
 | name               |                 | user_id (FK)        |
 | email (UNIQUE)     |                 | source              |
 | password (BCrypt)  |                 | amount              |
 | role (USER/ADMIN)  |                 | date                |
 | currency           |                 | reference           |
 | alert_threshold    |                 | notes               |
 +--------------------+                 +---------------------+
          |
          | 1:N
          v
 +--------------------+       1:N       +---------------------+
 |      expenses      | <-------------> |    expense_tags     |
 +--------------------+                 +---------------------+
 | id (PK)            |                 | expense_id (PK, FK) |
 | user_id (FK)       |                 | tag (PK)            |
 | category           |                 +---------------------+
 | amount             |
 | date               |
 | payment_method     |
 | description        |
 | receipt_url        |
 +--------------------+
          |
          | 1:N
          v
 +--------------------+
 |      budgets       |
 +--------------------+
 | id (PK)            |
 | user_id (FK)       |
 | category           |
 | budget_limit       |
 | month (YYYY-MM)    |
 +--------------------+
 (UNIQUE: user_id, category, month)
```

---

## 🚀 How to Execute with MySQL

### Option 1: Automatic Management via Spring Boot
Spring Boot Hibernate automatically initializes all tables (`ddl-auto=update`) and seeds the initial demo data via `DataInitializer.java` on application startup. You only need MySQL running on port 3306.

### Option 2: MySQL Command Line / Terminal
```bash
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS expensedb;"
mysql -u root -p expensedb < schema/schema.sql
mysql -u root -p expensedb < schema/data.sql
```

### Option 3: Docker Compose
From the project root:
```bash
docker compose up -d
```
This starts an isolated MySQL 8 container with database `expensedb`, root user, and password `root` on port `3306`.

### Option 4: MySQL Workbench / DBeaver / phpMyAdmin
1. Connect to your MySQL server.
2. Execute `CREATE DATABASE IF NOT EXISTS expensedb;` and select `expensedb`.
3. Open and run `schema.sql`, then open and run `data.sql`.
