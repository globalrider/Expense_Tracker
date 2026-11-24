import { apiClient } from './client';
import { formatCurrency } from '../utils/formatters';

export const apiService = {
  // ------------------------------------
  // AUTHENTICATION & USERS
  // ------------------------------------
  auth: {
    async login(email, password, username, expectedRole) {
      const data = await apiClient.post('/auth/login', {
        email,
        password,
        username,
        expectedRole,
      });
      apiClient.setTokens(data.token, data.refreshToken);
      apiClient.setCurrentUser(data.user);
      return data; // { token, user, role }
    },

    async register(userData) {
      const data = await apiClient.post('/auth/register', userData);
      apiClient.setTokens(data.token, data.refreshToken);
      apiClient.setCurrentUser(data.user);
      return data;
    },

    async updateProfile(profileData) {
      const data = await apiClient.put('/auth/profile', profileData);
      apiClient.setCurrentUser(data);
      return data;
    },

    getCurrentUser() {
      return apiClient.getCurrentUser();
    },

    logout() {
      apiClient.clearTokens();
      apiClient.setCurrentUser(null);
    },
  },

  // ------------------------------------
  // ADMIN USER MANAGEMENT
  // ------------------------------------
  admin: {
    async getAllUsers() {
      return await apiClient.get('/admin/users');
    },

    async getStats() {
      return await apiClient.get('/admin/stats');
    },

    async createUser(userData) {
      return await apiClient.post('/admin/users', userData);
    },

    async updateUser(id, updatedData) {
      return await apiClient.put(`/admin/users/${id}`, updatedData);
    },

    async deleteUser(id) {
      return await apiClient.delete(`/admin/users/${id}`);
    },
  },

  // ------------------------------------
  // INCOME MANAGEMENT (User-Scoped)
  // ------------------------------------
  incomes: {
    async getAll() {
      return await apiClient.get('/incomes');
    },

    async create(income) {
      return await apiClient.post('/incomes', income);
    },

    async update(id, updatedData) {
      return await apiClient.put(`/incomes/${id}`, updatedData);
    },

    async delete(id) {
      return await apiClient.delete(`/incomes/${id}`);
    },
  },

  // ------------------------------------
  // EXPENSE MANAGEMENT (User-Scoped)
  // ------------------------------------
  expenses: {
    async getAll() {
      return await apiClient.get('/expenses');
    },

    async create(expense) {
      return await apiClient.post('/expenses', expense);
    },

    async update(id, updatedData) {
      return await apiClient.put(`/expenses/${id}`, updatedData);
    },

    async delete(id) {
      return await apiClient.delete(`/expenses/${id}`);
    },
  },

  // ------------------------------------
  // BUDGET MANAGEMENT (User-Scoped)
  // ------------------------------------
  budgets: {
    async getAll() {
      return await apiClient.get('/budgets');
    },

    async setBudget(category, limit, month) {
      return await apiClient.post('/budgets', { category, limit, month });
    },

    async deleteBudget(id) {
      return await apiClient.delete(`/budgets/${id}`);
    },
  },

  // ------------------------------------
  // SMART ALERTS & NOTIFICATIONS
  // ------------------------------------
  alerts: {
    calculateAlerts(expenses = [], budgets = [], userThreshold = 80, selectedMonth = '2026-11', currency = 'USD') {
      const monthExpenses = expenses.filter(e => e.date && e.date.startsWith(selectedMonth));
      const monthBudgets = budgets.filter(b => b.month === selectedMonth);

      const categorySpent = {};
      monthExpenses.forEach(exp => {
        categorySpent[exp.category] = (categorySpent[exp.category] || 0) + (parseFloat(exp.amount) || 0);
      });

      const alerts = [];

      monthBudgets.forEach(budget => {
        const spent = categorySpent[budget.category] || 0;
        const percentage = budget.limit > 0 ? Math.round((spent / budget.limit) * 100) : 0;

        if (percentage >= 100) {
          alerts.push({
            id: `alert-over-${budget.category}`,
            type: 'CRITICAL',
            title: `Budget Exceeded: ${budget.category}`,
            message: `You have spent ${formatCurrency(spent, currency)} (${percentage}%), which exceeds your monthly limit of ${formatCurrency(budget.limit, currency)}!`,
            category: budget.category,
            spent,
            limit: budget.limit,
            percentage,
            date: new Date().toISOString(),
          });
        } else if (percentage >= userThreshold) {
          alerts.push({
            id: `alert-warn-${budget.category}`,
            type: 'WARNING',
            title: `Approaching Budget Limit: ${budget.category}`,
            message: `You have reached ${percentage}% (${formatCurrency(spent, currency)} of ${formatCurrency(budget.limit, currency)}) of your set limit for this month.`,
            category: budget.category,
            spent,
            limit: budget.limit,
            percentage,
            date: new Date().toISOString(),
          });
        }
      });

      // Overall monthly savings check
      const totalSpentMonth = monthExpenses.reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0);
      const totalBudgetMonth = monthBudgets.reduce((sum, b) => sum + (parseFloat(b.limit) || 0), 0);

      if (totalBudgetMonth > 0) {
        const totalPerc = Math.round((totalSpentMonth / totalBudgetMonth) * 100);
        if (totalPerc >= 100) {
          alerts.push({
            id: 'alert-total-over',
            type: 'CRITICAL',
            title: 'Overall Monthly Budget Exceeded',
            message: `Your total spending this month (${formatCurrency(totalSpentMonth, currency)}) has surpassed your total budget (${formatCurrency(totalBudgetMonth, currency)}).`,
            spent: totalSpentMonth,
            limit: totalBudgetMonth,
            percentage: totalPerc,
            date: new Date().toISOString(),
          });
        } else if (totalPerc >= userThreshold) {
          alerts.push({
            id: 'alert-total-warn',
            type: 'WARNING',
            title: 'High Overall Monthly Spending',
            message: `You have utilized ${totalPerc}% of your combined monthly budget (${formatCurrency(totalSpentMonth, currency)} / ${formatCurrency(totalBudgetMonth, currency)}).`,
            spent: totalSpentMonth,
            limit: totalBudgetMonth,
            percentage: totalPerc,
            date: new Date().toISOString(),
          });
        }
      }

      return alerts;
    },
  },

  // ------------------------------------
  // ACTUATOR SYSTEM MONITORING
  // ------------------------------------
  actuator: {
    async getHealth() {
      return await apiClient.getActuator('/actuator/health');
    },

    async getInfo() {
      return await apiClient.getActuator('/actuator/info');
    },

    async getMetricsList() {
      return await apiClient.getActuator('/actuator/metrics');
    },

    async getMetric(metricName) {
      return await apiClient.getActuator(`/actuator/metrics/${metricName}`);
    },

    async getOverview() {
      try {
        const [healthRes, infoRes, jvmUsedRes, jvmMaxRes, uptimeRes, cpuRes, threadsRes, hikariActiveRes] =
          await Promise.allSettled([
            apiClient.getActuator('/actuator/health'),
            apiClient.getActuator('/actuator/info'),
            apiClient.getActuator('/actuator/metrics/jvm.memory.used'),
            apiClient.getActuator('/actuator/metrics/jvm.memory.max'),
            apiClient.getActuator('/actuator/metrics/process.uptime'),
            apiClient.getActuator('/actuator/metrics/system.cpu.usage'),
            apiClient.getActuator('/actuator/metrics/jvm.threads.live'),
            apiClient.getActuator('/actuator/metrics/hikaricp.connections.active'),
          ]);

        const health = healthRes.status === 'fulfilled' ? healthRes.value : null;
        const info = infoRes.status === 'fulfilled' ? infoRes.value : null;
        const jvmUsedBytes = jvmUsedRes.status === 'fulfilled' ? (jvmUsedRes.value?.measurements?.[0]?.value || 0) : 0;
        const jvmMaxBytes = jvmMaxRes.status === 'fulfilled' ? (jvmMaxRes.value?.measurements?.[0]?.value || 0) : 0;
        const uptimeSeconds = uptimeRes.status === 'fulfilled' ? (uptimeRes.value?.measurements?.[0]?.value || 0) : 0;
        const cpuUsage = cpuRes.status === 'fulfilled' ? (cpuRes.value?.measurements?.[0]?.value || 0) : 0;
        const liveThreads = threadsRes.status === 'fulfilled' ? (threadsRes.value?.measurements?.[0]?.value || 0) : 0;
        const activeDbConnections =
          hikariActiveRes.status === 'fulfilled' ? (hikariActiveRes.value?.measurements?.[0]?.value || 0) : 0;

        return {
          isOnline: !!health,
          health,
          info,
          jvmUsedBytes,
          jvmMaxBytes,
          uptimeSeconds,
          cpuUsage,
          liveThreads,
          activeDbConnections,
          lastChecked: new Date().toLocaleTimeString(),
        };
      } catch (err) {
        console.error('Actuator overview fetch failed:', err);
        return {
          isOnline: false,
          error: err.message,
          lastChecked: new Date().toLocaleTimeString(),
        };
      }
    },
  },
};
