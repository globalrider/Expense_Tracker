# 💰 SmartSpend - Enterprise Expense Tracker & Budget Management

A modern, responsive, full-stack Expense and Budget Tracker powered by a **Spring Boot 3 + MySQL** REST backend and a **Vite + React 19 + Tailwind CSS** frontend.

---

## 🌟 Key Highlights & Implementation Details

### 1. 🗄️ MySQL Database Migration
- Completely migrated from H2 to **MySQL 8.0+** with `com.mysql:mysql-connector-j`.
- Automatic database initialization (`createDatabaseIfNotExist=true`) creates the `expensedb` schema seamlessly on launch.
- Pre-configured `docker-compose.yml` included for instant containerized MySQL provisioning with persistent data volume.
- Schema scripts updated under `schema/schema.sql` and `schema/data.sql`.

### 2. 🔐 Authentication: Two-Role Portal & Sole Admin Account
- **Dedicated Two-Role Login Portal (`LoginPage.jsx`)**:
  - Interactive **Role Selector**: `[ 👤 Regular User ]` and `[ 🛡️ System Admin ]`.
  - **Administrator Sign In (`ROLE_ADMIN`)**:
    - Strictly authorized to the single designated administrator account:
      - **Username:** `itachi`
      - **Gmail Address:** `itachi@gmail.com`
      - **Password:** `itachi@1313`
    - Entering any mismatched username, email, or password immediately throws an access denied error and prevents access to admin features.
    - **No Public Admin Creation:** Administrator accounts cannot be created publicly; public registration strictly provisions standard `ROLE_USER` accounts.
  - **Regular User Sign In & Registration (`ROLE_USER`)**:
    - Allows standard users to log in or register new accounts.
    - Captures **Photo / Avatar** (interactive live preview circle, custom URL input, and 6 preset avatar options).
    - Captures **Profession / Job Title** with one-click suggestion chips (`Software Engineer`, `UI/UX Designer`, `Product Manager`, `Data Analyst`, etc.) and a dynamic custom text box when `+ Other (Not in list)` is selected.
  - **Sole Seeded Administrator Account**:
    - 🛡️ **itachi** (`itachi@gmail.com` / `itachi@1313`) — *System Administrator (User Directory & Management)*

### 3. 🛡️ Admin Restrictions (User Management Only)
- The Administrator dashboard (`AdminDashboard.jsx`) is restricted strictly to:
  - **Who Are the Users** (User Directory with profile photos, email, profession, currency, registration timestamp).
  - **User Management**:
    - Add New User with profession and avatar (strictly provisions `ROLE_USER`).
    - Edit existing user name, profession, and avatar.
    - Delete user with full cascading deletion of associated records (the primary `itachi` account cannot be deleted or downgraded).
- Personal financial tracking tabs (Expenses, Incomes, Budgets, Analytics, Reports) are hidden for the Administrator account.

### 4. 🔒 User Data Isolation
- **Strict Data Segregation**: When any user logs in, only their own financial data is visible.
- Backend resolves user identity via `X-User-Email` and `X-User-Id` request headers (and JWT Bearer fallback).
- Incomes, expenses, category budgets, and analytics are query-filtered by `user_id`.
- Users cannot read, modify, or delete another user's financial transactions.

### 5. 🌐 Universal CORS Solution
- Universal CORS filter configured via `CorsConfig.java` with `FilterRegistrationBean<CorsFilter>` set to `Ordered.HIGHEST_PRECEDENCE`.
- Handles `OPTIONS` preflight requests cleanly across all endpoints.
- Permits all local dev origins (`http://localhost:5173`, `http://localhost:3000`, `http://127.0.0.1:5173`, etc.), methods (`GET, POST, PUT, DELETE, OPTIONS, PATCH`), and headers.

### 6. 🌓 Dark & Light Theme Switching
- Two polished themes: **Dark Theme** and **Light Theme**.
- Class-based Tailwind dark styling (`.dark` on `document.documentElement`).
- Dedicated theme toggle button (Sun/Moon icon) available on both the **Login Page** and the **Navbar**.
- State persisted in browser `localStorage` (`EXPENSE_TRACKER_THEME`) for continuous user experience across sessions.

### 7. 🌍 Multi-Currency Support (11 Global Currencies)
- **Supported Currencies**:
  - `USD ($)` — US Dollar (`en-US`)
  - `EUR (€)` — Euro (`de-DE`)
  - `GBP (£)` — British Pound (`en-GB`)
  - `INR (₹)` — Indian Rupee (`en-IN`)
  - `JPY (¥)` — Japanese Yen (`ja-JP`)
  - `CAD (CA$)` — Canadian Dollar (`en-CA`)
  - `AUD (AU$)` — Australian Dollar (`en-AU`)
  - `CHF (CHF)` — Swiss Franc (`de-CH`)
  - `CNY (CN¥)` — Chinese Yuan (`zh-CN`)
  - `SGD (SG$)` — Singapore Dollar (`en-SG`)
  - `AED (AED)` — UAE Dirham (`ar-AE`)
- **Live Currency Switcher**: Available in the top **Navbar**; changing currency instantaneously updates all stats, cards, tables, charts, and reports throughout the application.
- **Account Default Currency**: Selectable during user registration and editable in the user profile; synced to the MySQL backend via `PUT /api/v1/auth/profile`.
- **Dynamic Form Inputs**: Expense, Income, and Budget modals automatically update amount labels and prefix icons to match the active currency (`Amount ($)`, `Amount (€)`, `Amount (₹)`, etc.).
- **Smart Alerts in Currency**: Exceeded and approaching budget notifications are rendered in the user's chosen currency format.

### 8. ⚡ Spring Boot Actuator & System Health Monitoring
- **Spring Boot 3 Starter Actuator (`spring-boot-starter-actuator`)**:
  - Integrated into `backend/pom.xml` for production-grade operational monitoring and telemetry.
- **Actuator Configuration (`application.properties`)**:
  - `management.endpoints.web.base-path=/actuator`: Default root endpoint for discovery.
  - `management.endpoints.web.exposure.include=health,info,metrics,env,loggers,beans,mappings`: Exposes key endpoints over HTTP.
  - `management.endpoint.health.show-details=always`: Full subsystem health transparency (Database, Disk Space, Ping).
  - `management.endpoint.health.show-components=always`: Displays detailed component liveness breakdown.
  - `management.info.env.enabled=true`: Exposes application environment and profile details.
- **Live Monitoring Tab in Admin Dashboard (`AdminDashboard.jsx`)**:
  - Seamlessly embedded in the Administrator Portal for Administrator **Itachi**.
  - **Live Status & Liveness Probe**: Displays real-time `UP` status with glowing pulse indicators.
  - **Subsystem Component Health**:
    - **Database (`db`)**: Real-time MySQL connection verification via `isValid()`.
    - **Disk Space (`diskSpace`)**: Free and total disk space statistics.
    - **Liveness Ping (`ping`)**: Continuous connection probe.
    - **Security Subsystem**: Single-Admin architecture enforcement (`itachi`).
  - **5 Live System Performance Gauges**:
    - **JVM Heap Memory**: Used vs Max memory with visual progress gauge and ratio.
    - **Host CPU Load**: Real-time CPU percentage indicator.
    - **Continuous Process Uptime**: Formatted runtime duration (days, hours, minutes, seconds).
    - **JVM Live Threads**: Concurrency, worker, and GC thread counts.
    - **HikariCP Connection Pool**: Active database connections in `ExpenseTrackerHikariPool`.
  - **Actuator Endpoints Quick-Launch Hub**: One-click opening and clipboard copying for:
    - `/actuator` — Root hypermedia discovery index.
    - `/actuator/health` — Detailed health & component states.
    - `/actuator/metrics` — All available Micrometer metrics.
    - `/actuator/info` — Application metadata, version (`1.0.0`), and support info.
    - `/actuator/env` — Active profiles and runtime properties.
    - `/actuator/loggers` — Package log levels (`com.expensetracker`, `org.springframework.web`).
    - `/actuator/beans` — Spring application context bean graph.
    - `/actuator/mappings` — REST request mappings and controller routes.
    - `/swagger-ui.html` — Interactive OpenAPI Swagger UI documentation.
  - **Raw Diagnostics JSON Inspector**: Collapsible live JSON viewer for diagnostics and automated telemetry verification.

---

## 🚀 Quick Start Guide

### 1. Start MySQL Database
Using Docker Compose:
```bash
docker compose up -d
```
Or start your local MySQL service on port `3306` with database `expensedb`, user `root`, password `root`.

### 2. Start the Spring Boot Backend
From the `backend` folder:
```bash
cd backend
mvn spring-boot:run
```
Backend runs on: `http://localhost:8080/api/v1`

### 3. Start the Frontend
From the `frontend` folder:
```bash
cd frontend
npm install
npm run dev
```
Frontend runs on: `http://localhost:5173`

---

## 📁 Repository Structure

```
├── backend/
│   ├── src/main/java/com/expensetracker/
│   │   ├── config/CorsConfig.java          # Universal CORS filter & WebMvc config
│   │   ├── controller/                     # Auth, Admin, Expense, Income, Budget, Analytics
│   │   ├── model/User.java                 # User entity with profession & avatar
│   │   ├── repository/                     # User, Expense, Income, Budget repositories
│   │   ├── service/UserService.java        # User resolution, CRUD & cascading delete
│   │   └── init/DataInitializer.java       # Seeds 5 users + 1 admin with realistic data
│   ├── src/main/resources/
│   │   └── application.properties          # MySQL configuration
│   └── pom.xml                             # MySQL connector & Spring Boot 3 dependencies
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── admin/AdminDashboard.jsx    # User Directory & User Management view
│   │   │   ├── auth/LoginPage.jsx          # Dedicated Login + Register with Photo & Profession
│   │   │   ├── common/Navbar.jsx           # Top bar with theme toggle & user switcher
│   │   │   ├── common/Sidebar.jsx          # User-aware sidebar navigation
│   │   │   ├── dashboard/                  # Dashboard overview
│   │   │   ├── expense/                    # Expense management
│   │   │   ├── income/                     # Income streams
│   │   │   ├── budget/                     # Category budgets & progress bars
│   │   │   ├── analytics/                  # Donut chart & quarterly cash flow
│   │   │   ├── alerts/                     # Threshold alerts
│   │   │   └── reports/                    # Monthly financial reports
│   │   ├── context/
│   │   │   ├── AuthContext.jsx             # User auth state & RBAC
│   │   │   ├── ThemeContext.jsx            # Dark / Light theme switcher
│   │   │   └── DataContext.jsx             # User-isolated financial data state
│   │   ├── api/
│   │   │   ├── client.js                   # Attaches X-User-Email / X-User-Id & JWT
│   │   │   └── mockData.js                 # 5 users + 1 admin seeded data
│   │   └── App.jsx                         # Root router & layout
│   └── index.html
├── docker-compose.yml                      # MySQL 8.0 Docker Compose definition
└── schema/
    ├── schema.sql                          # MySQL DDL with profession & avatar
    └── data.sql                            # Pre-seeded users & sample records
```
