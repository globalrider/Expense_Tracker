import React from 'react';
import { formatCurrency, formatMonthYear } from '../../utils/formatters';

export const CashFlowBarChart = ({ monthlyComparison = [] }) => {
  if (monthlyComparison.length === 0) return null;

  // Find max value to calibrate height scale
  const maxVal = Math.max(
    ...monthlyComparison.map((m) => Math.max(m.income, m.expense)),
    1000
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
        <span>Monthly Income vs Expense Trend</span>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-500" />
            <span>Income</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-500" />
            <span>Expense</span>
          </div>
        </div>
      </div>

      <div className="pt-4 pb-2">
        <div className="grid grid-cols-3 gap-6 items-end h-44 border-b border-slate-200">
          {monthlyComparison.map((item) => {
            const incomeHeight = Math.round((item.income / maxVal) * 100);
            const expenseHeight = Math.round((item.expense / maxVal) * 100);

            return (
              <div key={item.month} className="flex flex-col items-center h-full justify-end">
                <div className="w-full flex items-end justify-center gap-2 h-full">
                  {/* Income bar */}
                  <div className="flex flex-col items-center w-8 sm:w-12 group relative">
                    <span className="opacity-0 group-hover:opacity-100 transition absolute -top-7 text-[10px] bg-slate-900 text-white px-1.5 py-0.5 rounded shadow pointer-events-none whitespace-nowrap z-10">
                      +{formatCurrency(item.income)}
                    </span>
                    <div
                      className="w-full bg-emerald-500 hover:bg-emerald-600 rounded-t-lg transition-all duration-500"
                      style={{ height: `${Math.max(incomeHeight, 4)}%` }}
                    />
                  </div>

                  {/* Expense bar */}
                  <div className="flex flex-col items-center w-8 sm:w-12 group relative">
                    <span className="opacity-0 group-hover:opacity-100 transition absolute -top-7 text-[10px] bg-slate-900 text-white px-1.5 py-0.5 rounded shadow pointer-events-none whitespace-nowrap z-10">
                      -{formatCurrency(item.expense)}
                    </span>
                    <div
                      className="w-full bg-rose-500 hover:bg-rose-600 rounded-t-lg transition-all duration-500"
                      style={{ height: `${Math.max(expenseHeight, 4)}%` }}
                    />
                  </div>
                </div>

                <div className="text-[11px] font-semibold text-slate-600 mt-2 text-center">
                  {formatMonthYear(item.month)}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
