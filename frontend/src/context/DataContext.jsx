import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { apiService } from '../api/apiService';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';
import { getCurrentYearMonth, EXPENSE_CATEGORIES } from '../utils/formatters';

const DataContext = createContext(null);

export const DataProvider = ({ children }) => {
  const { user } = useAuth();
  const { success, error } = useToast();

  const [incomes, setIncomes] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState('2026-11');
  const [loading, setLoading] = useState(false);

  // Fetch all initial data
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [incomeList, expenseList, budgetList] = await Promise.all([
        apiService.incomes.getAll(),
        apiService.expenses.getAll(),
        apiService.budgets.getAll(),
      ]);
      setIncomes(incomeList || []);
      setExpenses(expenseList || []);
      setBudgets(budgetList || []);
    } catch (err) {
      console.error('Failed to load data:', err);
      error('Failed to load financial records');
    } finally {
      setLoading(false);
    }
  }, [error]);

  useEffect(() => {
    loadData();
  }, [loadData, user]);

  // Income Operations
  const addIncome = async (incomeData) => {
    try {
      const created = await apiService.incomes.create({
        ...incomeData,
        userId: user?.id || 1,
      });
      setIncomes((prev) => [created, ...prev]);
      success('Income record added successfully!');
      return created;
    } catch (err) {
      error(err.message || 'Failed to add income');
      throw err;
    }
  };

  const updateIncome = async (id, updatedData) => {
    try {
      const updated = await apiService.incomes.update(id, updatedData);
      setIncomes((prev) => prev.map((item) => (item.id === id ? updated : item)));
      success('Income record updated!');
      return updated;
    } catch (err) {
      error(err.message || 'Failed to update income');
      throw err;
    }
  };

  const deleteIncome = async (id) => {
    try {
      await apiService.incomes.delete(id);
      setIncomes((prev) => prev.filter((item) => item.id !== id));
      success('Income record removed.');
    } catch (err) {
      error(err.message || 'Failed to delete income');
      throw err;
    }
  };

  // Expense Operations
  const addExpense = async (expenseData) => {
    try {
      const created = await apiService.expenses.create({
        ...expenseData,
        userId: user?.id || 1,
      });
      setExpenses((prev) => [created, ...prev]);
      success('Expense logged successfully!');
      return created;
    } catch (err) {
      error(err.message || 'Failed to log expense');
      throw err;
    }
  };

  const updateExpense = async (id, updatedData) => {
    try {
      const updated = await apiService.expenses.update(id, updatedData);
      setExpenses((prev) => prev.map((item) => (item.id === id ? updated : item)));
      success('Expense updated!');
      return updated;
    } catch (err) {
      error(err.message || 'Failed to update expense');
      throw err;
    }
  };

  const deleteExpense = async (id) => {
    try {
      await apiService.expenses.delete(id);
      setExpenses((prev) => prev.filter((item) => item.id !== id));
      success('Expense removed.');
    } catch (err) {
      error(err.message || 'Failed to delete expense');
      throw err;
    }
  };

  // Budget Operations
  const saveBudget = async (category, limit, month = selectedMonth) => {
    try {
      await apiService.budgets.setBudget(category, limit, month);
      const updatedBudgets = await apiService.budgets.getAll();
      setBudgets(updatedBudgets);
      success(`Budget set for ${category}: $${limit}`);
    } catch (err) {
      error(err.message || 'Failed to update budget limit');
      throw err;
    }
  };

  const deleteBudget = async (id) => {
    try {
      await apiService.budgets.deleteBudget(id);
      setBudgets((prev) => prev.filter((b) => b.id !== id));
      success('Budget limit removed.');
    } catch (err) {
      error(err.message || 'Failed to remove budget');
    }
  };

  // ------------------------------------
  // COMPUTED STATS & ANALYTICS
  // ------------------------------------
  const stats = useMemo(() => {
    // Current filtered month records
    const monthIncomes = incomes.filter(
      (inc) => inc.date && inc.date.startsWith(selectedMonth)
    );
    const monthExpenses = expenses.filter(
      (exp) => exp.date && exp.date.startsWith(selectedMonth)
    );
    const monthBudgets = budgets.filter((b) => b.month === selectedMonth);

    const totalIncome = monthIncomes.reduce(
      (acc, curr) => acc + (parseFloat(curr.amount) || 0),
      0
    );
    const totalExpenses = monthExpenses.reduce(
      (acc, curr) => acc + (parseFloat(curr.amount) || 0),
      0
    );
    const netSavings = totalIncome - totalExpenses;
    const savingsRate =
      totalIncome > 0 ? Math.round((netSavings / totalIncome) * 100) : 0;

    // Total monthly budget limit
    const totalBudget = monthBudgets.reduce(
      (acc, curr) => acc + (parseFloat(curr.limit) || 0),
      0
    );
    const budgetUsedPercentage =
      totalBudget > 0 ? Math.round((totalExpenses / totalBudget) * 100) : 0;
    const remainingBudget = totalBudget - totalExpenses;

    // Category-wise Breakdown
    const categoryTotals = {};
    monthExpenses.forEach((exp) => {
      categoryTotals[exp.category] =
        (categoryTotals[exp.category] || 0) + (parseFloat(exp.amount) || 0);
    });

    const categoryBreakdown = Object.entries(categoryTotals)
      .map(([category, amount]) => {
        const catInfo = EXPENSE_CATEGORIES.find((c) => c.name === category);
        const budgetItem = monthBudgets.find((b) => b.category === category);
        const limit = budgetItem ? budgetItem.limit : 0;
        const percentage =
          totalExpenses > 0 ? Math.round((amount / totalExpenses) * 100) : 0;
        const budgetPercent = limit > 0 ? Math.round((amount / limit) * 100) : 0;

        return {
          category,
          amount,
          limit,
          percentage,
          budgetPercent,
          color: catInfo ? catInfo.color : '#94a3b8',
        };
      })
      .sort((a, b) => b.amount - a.amount);

    // Multi-month comparison for trends
    const months = ['2026-09', '2026-10', '2026-11'];
    const monthlyComparison = months.map((m) => {
      const incSum = incomes
        .filter((i) => i.date && i.date.startsWith(m))
        .reduce((sum, i) => sum + (parseFloat(i.amount) || 0), 0);
      const expSum = expenses
        .filter((e) => e.date && e.date.startsWith(m))
        .reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0);
      return {
        month: m,
        income: incSum,
        expense: expSum,
        savings: incSum - expSum,
      };
    });

    return {
      totalIncome,
      totalExpenses,
      netSavings,
      savingsRate,
      totalBudget,
      remainingBudget,
      budgetUsedPercentage,
      categoryBreakdown,
      monthlyComparison,
      monthIncomes,
      monthExpenses,
      monthBudgets,
    };
  }, [incomes, expenses, budgets, selectedMonth]);

  // Dynamic Smart Alerts
  const alerts = useMemo(() => {
    return apiService.alerts.calculateAlerts(
      expenses,
      budgets,
      user?.monthlyBudgetAlertThreshold || 80,
      selectedMonth,
      user?.currency || 'USD'
    );
  }, [expenses, budgets, user?.monthlyBudgetAlertThreshold, selectedMonth, user?.currency]);

  return (
    <DataContext.Provider
      value={{
        incomes,
        expenses,
        budgets,
        alerts,
        selectedMonth,
        setSelectedMonth,
        stats,
        loading,
        reloadAll: loadData,
        addIncome,
        updateIncome,
        deleteIncome,
        addExpense,
        updateExpense,
        deleteExpense,
        saveBudget,
        deleteBudget,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
