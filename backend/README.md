# 🍃 Expense Tracker - Spring Boot 3 Backend

Full-featured Spring Boot 3 REST API backend configured for **MySQL 8.0+** with lightweight authentication, universal CORS support, and per-user data segregation.

---

## 🛠️ Tech Stack & Key Features

- **Java**: 17+ (Compatible with Java 21 & Java 25)
- **Framework**: Spring Boot 3.4.2
- **Database**: MySQL 8.0+ (`com.mysql:mysql-connector-j`)
- **Persistence**: Spring Data JPA + Hibernate with MySQL dialect
- **Lightweight Auth**: Custom REST auth (`/api/v1/auth/login`, `/api/v1/auth/register`) with `X-User-Email` and `X-User-Id` request context resolution
- **Universal CORS**: Registered `FilterRegistrationBean<CorsFilter>` with `Ordered.HIGHEST_PRECEDENCE` handling all cross-origin requests & preflight `OPTIONS`
- **Data Isolation**: All transaction controllers (`IncomeController`, `ExpenseController`, `BudgetController`, `AnalyticsController`, `TransactionController`) resolve user context and enforce per-user isolation
- **Admin Control**: Dedicated `AdminController` at `/api/v1/admin` providing user directory listing, user creation, updating, role toggling, and cascading deletion

---

## 🗄️ MySQL Database Setup

### 1. Connection Defaults
Configured in `src/main/resources/application.properties`:
- **JDBC URL**: `jdbc:mysql://localhost:3306/expensedb?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true`
- **Username**: `root`
- **Password**: `root`
- **Dialect**: `org.hibernate.dialect.MySQLDialect`
- **DDL Mode**: `update` (auto-creates tables and updates schema)

### 2. Optional: Run MySQL with Docker
From the project root directory:
```bash
docker compose up -d
```

### 3. Optional: Manual SQL Schema Import
```bash
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS expensedb;"
mysql -u root -p expensedb < ../schema/schema.sql
mysql -u root -p expensedb < ../schema/data.sql
```

---

## 🔑 Pre-Seeded Accounts (5 Users + 1 Admin)

Automatic data initialization via `DataInitializer.java`:

| Name | Email | Password | Role | Profession | Access Scope |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Alex Morgan** | `alex@example.com` | `password123` | `ROLE_USER` | Senior Software Engineer | Isolated personal finance |
| **Emma Watson** | `emma@example.com` | `password123` | `ROLE_USER` | UI/UX Designer | Isolated personal finance |
| **David Miller** | `david@example.com` | `password123` | `ROLE_USER` | Product Manager | Isolated personal finance |
| **Sophia Chen** | `sophia@example.com` | `password123` | `ROLE_USER` | Data Analyst & Researcher | Isolated personal finance |
| **James Wilson** | `james@example.com` | `password123` | `ROLE_USER` | Growth Marketing Lead | Isolated personal finance |
| **Admin Sarah** | `admin@example.com` | `admin123` | `ROLE_ADMIN` | System Administrator | User Directory & User Management only |

---

## 📡 REST API Summary

### Authentication (`/api/v1/auth`)
- `POST /api/v1/auth/login` - Authenticate user credentials
- `POST /api/v1/auth/register` - Create user (strictly `ROLE_USER` with `profession` & `avatar`)
- `GET /api/v1/auth/me` - Current user profile

### User Management (`/api/v1/admin`)
- `GET /api/v1/admin/users` - List all registered users (User Directory)
- `GET /api/v1/admin/stats` - User counts and statistics
- `POST /api/v1/admin/users` - Create user from admin panel
- `PUT /api/v1/admin/users/{id}` - Update user details or role
- `DELETE /api/v1/admin/users/{id}` - Cascading delete user and their records

### User-Isolated Financial Data
- `GET|POST|PUT|DELETE /api/v1/incomes` - User incomes
- `GET|POST|PUT|DELETE /api/v1/expenses` - User expenses
- `GET|POST|DELETE /api/v1/budgets` - Category budgets
- `GET /api/v1/analytics/dashboard` - User-specific summary and analytics
