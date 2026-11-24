import React from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { StatCard } from '../common/StatCard';
import { ProgressBar } from '../common/ProgressBar';
import { CategoryDonutChart } from '../analytics/CategoryDonutChart';
import { formatCurrency, formatDate, formatMonthYear } from '../../utils/formatters';
import {
  TrendingUp,
  TrendingDown,
  PiggyBank,
  Target,
  ArrowDownLeft,
  ArrowUpRight,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Briefcase,
} from 'lucide-react';

export const DashboardOverview = ({ setActiveTab, onOpenIncomeModal, onOpenExpenseModal, onOpenBudgetModal }) => {
  const { stats, selectedMonth, alerts } = useData();
  const { user } = useAuth();
  const {
    totalIncome,
    totalExpenses,
    netSavings,
    savingsRate,
    totalBudget,
    remainingBudget,
    budgetUsedPercentage,
    categoryBreakdown,
    monthIncomes,
    monthExpenses,
    monthBudgets,
  } = stats;

  // Combine recent incomes & expenses
  const recentTransactions = [
    ...monthIncomes.map((i) => ({ ...i, type: 'INCOME' })),
    ...monthExpenses.map((e) => ({ ...e, type: 'EXPENSE' })),
  ]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 6);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-indigo-700 via-indigo-800 to-violet-800 text-white p-6 sm:p-8 rounded-3xl shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-8 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-xs font-semibold backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Financial Overview for {formatMonthYear(selectedMonth)}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Hello, {user?.name || 'Explorer'}!
            </h2>
            <p className="text-xs sm:text-sm text-indigo-100 max-w-lg leading-relaxed flex items-center gap-2">
              <span className="inline-flex items-center gap-1 bg-white/20 px-2 py-0.5 rounded-lg text-xs font-semibold">
                <Briefcase className="w-3.5 h-3.5" />
                {user?.profession || 'Professional'}
              </span>
              <span>Saved <strong className="text-white">{formatCurrency(netSavings)}</strong> with a <strong className="text-white">{savingsRate}%</strong> savings rate.</span>
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={onOpenIncomeModal}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold shadow-md transition"
            >
              <ArrowDownLeft className="w-4 h-4" />
              <span>Add Income</span>
            </button>
            <button
              onClick={onOpenExpenseModal}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-semibold shadow-md transition"
            >
              <ArrowUpRight className="w-4 h-4" />
              <span>Record Expense</span>
            </button>
            <button
              onClick={onOpenBudgetModal}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-semibold backdrop-blur-md border border-white/20 transition"
            >
              <Target className="w-4 h-4" />
              <span>Set Budget</span>
            </button>
          </div>
        </div>
      </div>

      {/* Smart Alert Banner (if any) */}
      {alerts.length > 0 && (
        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/60 shadow-sm flex items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-slate-100">
                {alerts[0].title}
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-400 line-clamp-1">{alerts[0].message}</div>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('alerts')}
            className="text-xs font-bold text-amber-800 dark:text-amber-300 hover:underline shrink-0 flex items-center gap-1"
          >
            Review ({alerts.length}) <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Core KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Income"
          value={formatCurrency(totalIncome)}
          icon={TrendingUp}
          color="emerald"
          subtext={`${monthIncomes.length} earnings registered`}
        />
        <StatCard
          title="Total Expenses"
          value={formatCurrency(totalExpenses)}
          icon={TrendingDown}
          color="rose"
          subtext={`${monthExpenses.length} payments recorded`}
        />
        <StatCard
          title="Net Savings"
          value={formatCurrency(netSavings)}
          icon={PiggyBank}
          color="indigo"
          subtext={`${savingsRate}% savings target achieved`}
        />
        <StatCard
          title="Budget Utilization"
          value={`${budgetUsedPercentage}%`}
          icon={Target}
          color={budgetUsedPercentage >= 90 ? 'rose' : budgetUsedPercentage >= 75 ? 'amber' : 'emerald'}
          subtext={`${formatCurrency(remainingBudget)} buffer left`}
        />
      </div>

      {/* Split Section: Budget Tracking & Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Category Breakdown Preview */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm transition-colors">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">Category Spending</h3>
              <p className="text-xs text-slate-400 dark:text-slate-500">Proportional breakdown of this month's expenses</p>
            </div>
            <button
              onClick={() => setActiveTab('analytics')}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
            >
              Analytics <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <CategoryDonutChart
            categoryBreakdown={categoryBreakdown}
            totalExpenses={totalExpenses}
          />
        </div>

        {/* Right: Key Budget Watchlist */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between transition-colors">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">Budget Watchlist</h3>
                <p className="text-xs text-slate-400 dark:text-slate-500">Spending limits &amp; capacity</p>
              </div>
              <button
                onClick={() => setActiveTab('budget')}
                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
              >
                All Limits <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-4">
              {monthBudgets.slice(0, 4).map((b) => {
                const spent = monthExpenses
                  .filter((e) => e.category === b.category)
                  .reduce((acc, curr) => acc + (parseFloat(curr.amount) || 0), 0);
                const perc = b.limit > 0 ? Math.round((spent / b.limit) * 100) : 0;

                return (
                  <div key={b.id} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-700 dark:text-slate-200">{b.category}</span>
                      <span className="text-slate-500 dark:text-slate-400 font-medium">
                        {formatCurrency(spent)} / {formatCurrency(b.limit)} ({perc}%)
                      </span>
                    </div>
                    <ProgressBar percentage={perc} height="h-2" />
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Overall Budget Limit: {formatCurrency(totalBudget)}</span>
            <span className="font-semibold text-indigo-600 dark:text-indigo-400">{budgetUsedPercentage}% Used</span>
          </div>
        </div>
      </div>

      {/* Recent Transactions Feed */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm transition-colors">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">Recent Transactions</h3>
            <p className="text-xs text-slate-400 dark:text-slate-500">Latest earnings and expenditures</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('income')}
              className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
            >
              All Incomes
            </button>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <button
              onClick={() => setActiveTab('expenses')}
              className="text-xs font-semibold text-rose-600 dark:text-rose-400 hover:underline"
            >
              All Expenses
            </button>
          </div>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {recentTransactions.map((tx) => {
            const isIncome = tx.type === 'INCOME';

            return (
              <div
                key={tx.id}
                className="py-3 flex items-center justify-between hover:bg-slate-50/70 dark:hover:bg-slate-800/60 px-2 rounded-2xl transition"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2.5 rounded-2xl border ${
                      isIncome
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
                        : 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-800'
                    }`}
                  >
                    {isIncome ? (
                      <ArrowDownLeft className="w-4 h-4" />
                    ) : (
                      <ArrowUpRight className="w-4 h-4" />
                    )}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white">
                      {isIncome ? tx.source : tx.description}
                    </div>
                    <div className="text-[11px] text-slate-400 dark:text-slate-500">
                      {isIncome ? tx.reference || 'Deposit' : tx.category} • {formatDate(tx.date)}
                    </div>
                  </div>
                </div>

                <div
                  className={`text-sm font-bold ${
                    isIncome ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                  }`}
                >
                  {isIncome ? `+${formatCurrency(tx.amount)}` : `-${formatCurrency(tx.amount)}`}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
