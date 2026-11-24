import React from 'react';
import { useData } from '../../context/DataContext';
import { formatCurrency, formatDate, formatMonthYear, EXPENSE_CATEGORIES } from '../../utils/formatters';
import { exportTransactionsToCSV, triggerPrintReport } from '../../utils/exportUtils';
import {
  FileSpreadsheet,
  Download,
  Printer,
  Calendar,
  CheckCircle2,
  TrendingUp,
  TrendingDown,
  PiggyBank,
  ShieldCheck,
  Layers,
} from 'lucide-react';

export const MonthlyReportView = () => {
  const { stats, selectedMonth, incomes, expenses } = useData();
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
  } = stats;

  const handleExportCSV = () => {
    exportTransactionsToCSV(monthIncomes, monthExpenses, `monthly-report-${selectedMonth}.csv`);
  };

  // Determine financial health score
  let healthScore = 'Excellent';
  let healthColor = 'text-emerald-600 bg-emerald-50 border-emerald-200';
  let healthSummary = 'You have a high savings rate and your spending is well controlled.';

  if (netSavings < 0) {
    healthScore = 'Deficit / Needs Attention';
    healthColor = 'text-rose-600 bg-rose-50 border-rose-200';
    healthSummary = 'Monthly expenses exceeded incoming revenue. Review non-essential categories.';
  } else if (savingsRate < 15) {
    healthScore = 'Moderate';
    healthColor = 'text-amber-600 bg-amber-50 border-amber-200';
    healthSummary = 'Savings rate is under 15%. Aim to trim leisure and discretionary spending.';
  }

  return (
    <div className="space-y-6">
      {/* Top Banner & Export Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm transition-colors">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-sky-50 dark:bg-sky-950/50 text-sky-600 dark:text-sky-400 border border-sky-200 dark:border-sky-900/50">
              <FileSpreadsheet className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Monthly Financial Statement</h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Complete executive financial breakdown for {formatMonthYear(selectedMonth)}.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={triggerPrintReport}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs rounded-xl border border-slate-200 dark:border-slate-700 transition"
          >
            <Printer className="w-4 h-4" />
            <span>Print Report</span>
          </button>
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-md shadow-indigo-600/25 transition"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Printable Report Paper Layout */}
      <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6 transition-colors">
        {/* Report Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-5 gap-3">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Monthly Statement of Accounts</h3>
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              <Calendar className="w-3.5 h-3.5" />
              <span>Reporting Period: {formatMonthYear(selectedMonth)}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium">Health Rating:</span>
            <span className={`text-xs font-bold px-2.5 py-1 rounded-xl border ${healthColor}`}>
              {healthScore}
            </span>
          </div>
        </div>

        {/* 4 Core Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Total Inflow
            </span>
            <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
              +{formatCurrency(totalIncome)}
            </div>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 block">{monthIncomes.length} records</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Total Outflow
            </span>
            <div className="text-xl font-bold text-rose-600 dark:text-rose-400 mt-1">
              -{formatCurrency(totalExpenses)}
            </div>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 block">{monthExpenses.length} records</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Net Surplus / Savings
            </span>
            <div
              className={`text-xl font-bold mt-1 ${netSavings >= 0 ? 'text-indigo-600 dark:text-indigo-400' : 'text-rose-600 dark:text-rose-400'
                }`}
            >
              {formatCurrency(netSavings)}
            </div>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 block">{savingsRate}% savings rate</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Remaining Budget
            </span>
            <div
              className={`text-xl font-bold mt-1 ${remainingBudget >= 0 ? 'text-slate-900 dark:text-slate-100' : 'text-rose-600 dark:text-rose-400'
                }`}
            >
              {formatCurrency(remainingBudget)}
            </div>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 block">
              {budgetUsedPercentage}% cap utilized
            </span>
          </div>
        </div>

        {/* Category Breakdown Table */}
        <div>
          <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-3">
            Category Spending Summary
          </h4>
          <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="py-2.5 px-4">Category</th>
                  <th className="py-2.5 px-4">Spent Amount</th>
                  <th className="py-2.5 px-4">Share (%)</th>
                  <th className="py-2.5 px-4">Monthly Limit</th>
                  <th className="py-2.5 px-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {categoryBreakdown.map((cat) => {
                  const isOver = cat.limit > 0 && cat.amount > cat.limit;
                  return (
                    <tr key={cat.category} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                      <td className="py-2.5 px-4 font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                        <span
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: cat.color }}
                        />
                        <span>{cat.category}</span>
                      </td>
                      <td className="py-2.5 px-4 font-bold text-slate-800 dark:text-slate-200">
                        {formatCurrency(cat.amount)}
                      </td>
                      <td className="py-2.5 px-4 text-slate-600 dark:text-slate-400">{cat.percentage}%</td>
                      <td className="py-2.5 px-4 text-slate-500 dark:text-slate-400">
                        {cat.limit > 0 ? formatCurrency(cat.limit) : 'No limit set'}
                      </td>
                      <td className="py-2.5 px-4 text-right">
                        {cat.limit > 0 ? (
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${isOver ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400' : 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400'
                              }`}
                          >
                            {isOver ? `Over by ${cat.budgetPercent - 100}%` : `${cat.budgetPercent}% used`}
                          </span>
                        ) : (
                          <span className="text-slate-400 dark:text-slate-500 text-[11px]">-</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top 5 Expenses of the Month */}
        <div>
          <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-3">
            Top Outlays this Month
          </h4>
          <div className="space-y-2">
            {[...monthExpenses]
              .sort((a, b) => b.amount - a.amount)
              .slice(0, 5)
              .map((exp, idx) => (
                <div
                  key={exp.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50/80 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center font-bold text-[10px]">
                      {idx + 1}
                    </span>
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-slate-100">{exp.description}</div>
                      <div className="text-[11px] text-slate-400">
                        {exp.category} • {formatDate(exp.date)}
                      </div>
                    </div>
                  </div>
                  <div className="font-bold text-rose-600 dark:text-rose-400 text-sm">-{formatCurrency(exp.amount)}</div>
                </div>
              ))}
          </div>
        </div>

        {/* Executive Summary Footnote */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-xs text-slate-600 dark:text-slate-300">
          <span className="font-bold text-slate-800 dark:text-slate-200">Executive Summary Note: </span>
          {healthSummary}
        </div>
      </div>
    </div>
  );
};
