import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency, formatMonthYear } from '../../utils/formatters';
import {
  Bell,
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  Sliders,
  Sparkles,
  Info,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';

export const AlertsList = ({ setActiveTab }) => {
  const { alerts, stats, selectedMonth } = useData();
  const { user, updateProfile } = useAuth();

  const [threshold, setThreshold] = useState(user?.monthlyBudgetAlertThreshold || 80);
  const [isSaved, setIsSaved] = useState(false);

  const handleSaveThreshold = (newVal) => {
    setThreshold(newVal);
    updateProfile({ monthlyBudgetAlertThreshold: newVal });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm transition-colors">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-900/50">
              <Bell className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Smart Alerts & Warnings</h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Automated intelligence tracking your budget limits for {formatMonthYear(selectedMonth)}.
          </p>
        </div>

        {/* Alert Count Badge */}
        <div className="flex items-center gap-2">
          <span
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border ${alerts.length > 0
              ? 'bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-900/50'
              : 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/50'
              }`}
          >
            {alerts.length > 0 ? `${alerts.length} Active Alerts` : 'All Systems Healthy'}
          </span>
        </div>
      </div>

      {/* Threshold Configuration Card */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm transition-colors">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200">
              <Sliders className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>Smart Alert Threshold Setting</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Notify me whenever category spending hits or surpasses this percentage of its budget limit.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{threshold}%</span>
              <input
                type="range"
                min="50"
                max="95"
                step="5"
                value={threshold}
                onChange={(e) => handleSaveThreshold(parseInt(e.target.value, 10))}
                className="w-32 accent-indigo-600 cursor-pointer"
              />
            </div>
            {isSaved && (
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Saved
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Alerts Feed */}
      <div className="space-y-3">
        {alerts.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 p-12 rounded-2xl border border-slate-200/80 dark:border-slate-800 text-center transition-colors">
            <CheckCircle2 className="w-12 h-12 mx-auto text-emerald-400 mb-2" />
            <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200">No active alerts for this month</h4>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 max-w-sm mx-auto">
              Your spending in all categories is safely below your {threshold}% budget threshold.
            </p>
          </div>
        ) : (
          alerts.map((alert) => {
            const isCritical = alert.type === 'CRITICAL';

            return (
              <div
                key={alert.id}
                className={`p-5 rounded-2xl border transition shadow-sm ${isCritical
                  ? 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/50'
                  : 'bg-amber-50/50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/50'
                  }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3.5">
                    <div
                      className={`p-2.5 rounded-xl border mt-0.5 shrink-0 ${isCritical
                        ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-900/50'
                        : 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-900/50'
                        }`}
                    >
                      {isCritical ? (
                        <AlertCircle className="w-5 h-5" />
                      ) : (
                        <AlertTriangle className="w-5 h-5" />
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">{alert.title}</h4>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isCritical
                            ? 'bg-rose-200 dark:bg-rose-900/50 text-rose-800 dark:text-rose-300'
                            : 'bg-amber-200 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300'
                            }`}
                        >
                          {alert.percentage}% of Budget
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">{alert.message}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveTab('budget')}
                    className="shrink-0 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 flex items-center gap-1 bg-white dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm transition"
                  >
                    Manage Limit <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Proactive Savings Insights Banner */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-start gap-3.5 transition-colors">
        <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-900/50 shrink-0">
          <Sparkles className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Smart Financial Tip</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
            Categories like Food & Dining and Shopping typically see spikes in the final week of the month.
            Setting spending caps around 75% allows a buffer for unexpected weekend dinners and groceries.
          </p>
        </div>
      </div>
    </div>
  );
};
