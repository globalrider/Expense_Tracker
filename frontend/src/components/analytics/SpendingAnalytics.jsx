import React from 'react';
import { useData } from '../../context/DataContext';
import { CategoryDonutChart } from './CategoryDonutChart';
import { CashFlowBarChart } from './CashFlowBarChart';
import { StatCard } from '../common/StatCard';
import { formatCurrency, formatMonthYear } from '../../utils/formatters';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  PiggyBank,
  Percent,
  Wallet,
  ShieldCheck,
} from 'lucide-react';

export const SpendingAnalytics = () => {
  const { stats, selectedMonth } = useData();
  const {
    totalIncome,
    totalExpenses,
    netSavings,
    savingsRate,
    categoryBreakdown,
    monthlyComparison,
    monthExpenses,
  } = stats;

  const averageDailySpend = monthExpenses.length > 0 ? totalExpenses / 30 : 0;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm transition-colors">
        <div className="flex items-center gap-2">
          <span className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-900/50">
            <BarChart3 className="w-5 h-5" />
          </span>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Expense Analytics</h2>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Detailed metrics for {formatMonthYear(selectedMonth)}: spending breakdowns, cash flow, and monthly savings.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Income"
          value={formatCurrency(totalIncome)}
          icon={TrendingUp}
          color="emerald"
          subtext="Revenue inflow"
        />
        <StatCard
          title="Total Expenses"
          value={formatCurrency(totalExpenses)}
          icon={TrendingDown}
          color="rose"
          subtext="Expenditure outflow"
        />
        <StatCard
          title="Monthly Savings"
          value={formatCurrency(netSavings)}
          icon={PiggyBank}
          color="indigo"
          subtext={netSavings >= 0 ? 'Surplus retained' : 'Deficit'}
        />
        <StatCard
          title="Savings Rate"
          value={`${savingsRate}%`}
          icon={Percent}
          color={savingsRate >= 20 ? 'emerald' : 'amber'}
          subtext={savingsRate >= 20 ? 'Strong savings rate (>20%)' : 'Target: 20%+ of income'}
        />
      </div>

      {/* Chart Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Category Breakdown (Donut) */}
        <div className="lg:col-span-6 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm transition-colors">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">Category-Wise Breakdown</h3>
            <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">
              {categoryBreakdown.length} Categories
            </span>
          </div>
          <CategoryDonutChart
            categoryBreakdown={categoryBreakdown}
            totalExpenses={totalExpenses}
          />
        </div>

        {/* Cash Flow Comparison */}
        <div className="lg:col-span-6 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm transition-colors">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">Quarterly Cash Flow (3 Months)</h3>
            <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 px-2 py-0.5 rounded border border-indigo-200/50 dark:border-indigo-800">
              Trend
            </span>
          </div>
          <CashFlowBarChart monthlyComparison={monthlyComparison} />
        </div>
      </div>

      {/* Financial Health Summary */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 text-white p-6 rounded-2xl shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <h4 className="text-base font-bold">Monthly Financial Health Assessment</h4>
            </div>
            <p className="text-xs text-slate-300 max-w-xl">
              {netSavings >= 0
                ? `You have saved ${formatCurrency(netSavings)} this month (${savingsRate}% of total earnings). Your average daily expenditure is approximately ${formatCurrency(averageDailySpend)}.`
                : `Your monthly expenses have exceeded your income by ${formatCurrency(Math.abs(netSavings))}. Review uncapped categories in Budget Management.`}
            </p>
          </div>

          <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/10 shrink-0">
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-300">Daily Average</div>
              <div className="text-lg font-bold text-white">{formatCurrency(averageDailySpend)}</div>
            </div>
            <div className="h-8 w-px bg-white/20" />
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-300">Savings Status</div>
              <div className="text-sm font-bold text-emerald-400">
                {savingsRate >= 30 ? 'Excellent' : savingsRate >= 15 ? 'Good' : 'Needs Care'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
