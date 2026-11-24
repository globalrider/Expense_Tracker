# 🚀 Deploying Expense Tracker to Render

This project is fully configured for deployment on [Render](https://render.com).

The application consists of two decoupled services:
1. **Backend Web Service:** Spring Boot 3 REST API (Docker container, runs on port `$PORT`).
2. **Frontend Static Site:** React 19 + Vite Single Page Application.

---

## ⚡ Method 1: Instant 1-Click Blueprint (Recommended)

Render can auto-detect the provided [`render.yaml`](./render.yaml) blueprint file:

1. Log into your [Render Dashboard](https://dashboard.render.com).
2. Click **New +** > **Blueprint**.
3. Connect your GitHub repository: `https://github.com/globalrider/Expense_Tracker`.
4. Render will detect `render.yaml` and configure both services:
   - `expense-tracker-backend` (Docker Web Service)
   - `expense-tracker-frontend` (Static Site)
5. Click **Apply**.
6. Once deployed:
   - Copy the backend service URL (e.g., `https://expense-tracker-backend.onrender.com`).
   - In the frontend service settings on Render, set the environment variable:
     ```env
     VITE_API_BASE_URL=https://expense-tracker-backend.onrender.com/api/v1
     ```
   - Trigger a deploy for the frontend so it picks up the URL.

---

## 🛠️ Method 2: Manual Setup on Render

### Step A: Deploy the Backend (Web Service)

1. In Render Dashboard, click **New +** > **Web Service**.
2. Select your repository `Expense_Tracker`.
3. Configure the service:
   - **Name:** `expense-tracker-backend`
   - **Language / Runtime:** `Docker`
   - **Dockerfile Path:** `./backend/Dockerfile`
   - **Docker Build Context Directory:** `./backend`
   - **Instance Type:** `Free`
   - **Health Check Path:** `/actuator/health`
4. In **Environment Variables**, add:
   - `PORT`: `8080`
   - *(Optional external MySQL)*:
     - `SPRING_DATASOURCE_URL`: `jdbc:mysql://<host>:<port>/<dbname>?useSSL=true`
     - `SPRING_DATASOURCE_USERNAME`: `<db_user>`
     - `SPRING_DATASOURCE_PASSWORD`: `<db_password>`
   *(Note: If no MySQL variables are added, the backend will auto-run with its zero-config embedded H2 database in MySQL compatibility mode).*
5. Click **Deploy Web Service**.
6. When deployment finishes, copy your live backend URL (e.g., `https://expense-tracker-backend.onrender.com`).

---

### Step B: Deploy the Frontend (Static Site)

1. In Render Dashboard, click **New +** > **Static Site**.
2. Select your repository `Expense_Tracker`.
3. Configure the service:
   - **Name:** `expense-tracker-frontend`
   - **Root Directory:** `frontend`
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `dist`
4. In **Environment Variables**, add:
   - `VITE_API_BASE_URL`: `https://your-backend-name.onrender.com/api/v1`
5. In **Redirects/Rewrites**:
   - Add a rule:
     - **Type:** `Rewrite`
     - **Source:** `/*`
     - **Destination:** `/index.html`
   *(This ensures refreshing any client-side page does not trigger 404s).*
6. Click **Deploy Static Site**.

---

## 🗄️ Database Options on Render

1. **Zero-Configuration Embedded H2 (Default):**
   - Automatically activates if no remote MySQL URL is specified.
   - Ideal for instant testing, demos, and portfolios.
2. **Persistent Cloud MySQL (Free Tier Recommendations):**
   - [TiDB Serverless](https://tidb.cloud) (Free 25GB MySQL-compatible database).
   - [Aiven](https://aiven.io) (Free tier managed MySQL).
   - [Railway](https://railway.app) (Free MySQL plugin).
   - To connect, simply paste your cloud JDBC URL into the backend's `SPRING_DATASOURCE_URL` environment variable on Render.
