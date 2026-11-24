import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { BudgetModal } from './BudgetModal';
import { ProgressBar } from '../common/ProgressBar';
import { formatCurrency, EXPENSE_CATEGORIES } from '../../utils/formatters';
import {
  Target,
  Plus,
  AlertTriangle,
  CheckCircle2,
  Edit2,
  Trash2,
  Sparkles,
  TrendingDown,
} from 'lucide-react';

export const BudgetOverview = () => {
  const { stats, selectedMonth, saveBudget, deleteBudget } = useData();
  const { totalBudget, totalExpenses, remainingBudget, budgetUsedPercentage, monthBudgets, monthExpenses } = stats;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);
  const [defaultCategory, setDefaultCategory] = useState(null);

  // Map spending per category
  const categorySpentMap = {};
  monthExpenses.forEach((exp) => {
    categorySpentMap[exp.category] = (categorySpentMap[exp.category] || 0) + (parseFloat(exp.amount) || 0);
  });

  const handleOpenAdd = (catName = null) => {
    setEditingBudget(null);
    setDefaultCategory(catName);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (budget) => {
    setEditingBudget(budget);
    setDefaultCategory(null);
    setIsModalOpen(true);
  };

  const handleSaveBudget = async (category, limit, month) => {
    await saveBudget(category, limit, month);
  };

  // Find categories without explicit budgets
  const unbudgetedCategories = EXPENSE_CATEGORIES.filter(
    (cat) => !monthBudgets.some((b) => b.category === cat.id)
  );

  return (
    <div className="space-y-6">
      {/* Top Banner / Budget Summary */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-900/50">
                <Target className="w-5 h-5" />
              </span>
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Budget Management</h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Set monthly spending targets to curb excessive spending and maximize savings.
            </p>
          </div>

          <button
            onClick={() => handleOpenAdd(null)}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-md shadow-indigo-600/25 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Set Category Budget</span>
          </button>
        </div>

        {/* Global Summary Progress */}
        <div className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-xl border border-slate-200/80 dark:border-slate-700/60">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-3">
            <div>
              <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">Overall Month Budget Limit</div>
              <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">{formatCurrency(totalBudget)}</div>
            </div>

            <div className="flex items-center gap-6">
              <div>
                <div className="text-[11px] font-semibold text-slate-400">Total Spent</div>
                <div className="text-sm font-bold text-rose-600 dark:text-rose-400">{formatCurrency(totalExpenses)}</div>
              </div>
              <div>
                <div className="text-[11px] font-semibold text-slate-400">Remaining Buffer</div>
                <div
                  className={`text-sm font-bold ${remainingBudget >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                    }`}
                >
                  {formatCurrency(remainingBudget)}
                </div>
              </div>
              <div className="text-right">
                <div className="text-[11px] font-semibold text-slate-400">Cap Utilization</div>
                <div className="text-sm font-bold text-slate-800 dark:text-slate-200">{budgetUsedPercentage}%</div>
              </div>
            </div>
          </div>

          <ProgressBar percentage={budgetUsedPercentage} height="h-3" />
        </div>
      </div>

      {/* Category Budget Cards Grid */}
      <div>
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-3 flex items-center justify-between">
          <span>Active Category Budgets ({monthBudgets.length})</span>
        </h3>

        {monthBudgets.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200/80 dark:border-slate-800 text-center transition-colors">
            <Target className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-600 mb-2" />
            <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300">No category budgets defined for this month</h4>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
              Add limits to Food, Travel, Shopping and Education to stay in control.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {monthBudgets.map((budget) => {
              const spent = categorySpentMap[budget.category] || 0;
              const percentage = budget.limit > 0 ? Math.round((spent / budget.limit) * 100) : 0;
              const remaining = budget.limit - spent;
              const isOver = percentage >= 100;
              const isWarning = percentage >= 80 && !isOver;

              const catInfo = EXPENSE_CATEGORIES.find((c) => c.name === budget.category);

              return (
                <div
                  key={budget.id}
                  className={`bg-white dark:bg-slate-900 rounded-2xl p-5 border transition-all shadow-sm hover:shadow-md ${isOver
                    ? 'border-rose-300 dark:border-rose-900/60 bg-rose-50/20 dark:bg-rose-950/20'
                    : isWarning
                      ? 'border-amber-300 dark:border-amber-900/60 bg-amber-50/20 dark:bg-amber-950/20'
                      : 'border-slate-200/80 dark:border-slate-800'
                    }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-lg border ${catInfo?.bg || 'bg-slate-50 text-slate-700 border-slate-200'
                        }`}
                    >
                      {budget.category}
                    </span>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenEdit(budget)}
                        className="p-1 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
                        title="Edit Limit"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm(`Remove budget for ${budget.category}?`)) {
                            deleteBudget(budget.id);
                          }
                        }}
                        className="p-1 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition"
                        title="Delete Limit"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-baseline justify-between mb-1.5">
                    <div>
                      <span className="text-xl font-bold text-slate-900 dark:text-slate-100">
                        {formatCurrency(spent)}
                      </span>
                      <span className="text-xs text-slate-400 ml-1">
                        / {formatCurrency(budget.limit)}
                      </span>
                    </div>
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded-full ${isOver
                        ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400'
                        : isWarning
                          ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400'
                          : 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400'
                        }`}
                    >
                      {percentage}%
                    </span>
                  </div>

                  <ProgressBar percentage={percentage} height="h-2" />

                  <div className="mt-3 flex items-center justify-between text-xs pt-2 border-t border-slate-100 dark:border-slate-800">
                    <span className="text-slate-400">Remaining:</span>
                    <span
                      className={`font-semibold ${remaining >= 0 ? 'text-slate-700 dark:text-slate-300' : 'text-rose-600 dark:text-rose-400 font-bold'
                        }`}
                    >
                      {remaining >= 0 ? formatCurrency(remaining) : `Over by ${formatCurrency(Math.abs(remaining))}`}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Unbudgeted Categories Quick-Add Suggestion */}
      {unbudgetedCategories.length > 0 && (
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm transition-colors">
          <div className="flex items-center gap-2 mb-2 text-xs font-bold text-slate-700 dark:text-slate-300">
            <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span>Uncapped Categories (Click to add limit):</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {unbudgetedCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleOpenAdd(cat.name)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 hover:border-indigo-200 dark:hover:border-indigo-700 hover:text-indigo-700 dark:hover:text-indigo-300 text-xs font-medium text-slate-600 dark:text-slate-300 transition"
              >
                <Plus className="w-3.5 h-3.5 text-slate-400" />
                <span>{cat.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
