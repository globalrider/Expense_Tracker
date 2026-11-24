import React, { useState } from 'react';
import {
  Wallet,
  Bell,
  Calendar,
  Server,
  ShieldCheck,
  User,
  LogOut,
  ChevronDown,
  AlertTriangle,
  CheckCircle2,
  BookOpen,
  ArrowRight,
  Sun,
  Moon,
  Sparkles,
  Briefcase,
  Coins,
  Menu,
  X,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../context/ToastContext';
import { formatMonthYear, SUPPORTED_CURRENCIES, getCurrencySymbol, setAppCurrency } from '../../utils/formatters';

export const Navbar = ({ onOpenGuide, setActiveTab, isMobileMenuOpen, onToggleMobileMenu }) => {
  const { user, isAdmin, logout, updateProfile } = useAuth();
  const { selectedMonth, setSelectedMonth, alerts } = useData();
  const { theme, toggleTheme, isDark } = useTheme();
  const { success } = useToast();

  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showAlertsDropdown, setShowAlertsDropdown] = useState(false);

  const availableMonths = ['2026-11', '2026-10', '2026-09'];

  const handleCurrencyChange = async (e) => {
    const newCurrency = e.target.value;
    setAppCurrency(newCurrency);
    try {
      await updateProfile({ currency: newCurrency });
      success(`Currency switched to ${newCurrency} (${getCurrencySymbol(newCurrency)})`);
    } catch {
      success(`Display currency set to ${newCurrency}`);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 px-3 sm:px-6 lg:px-8 py-2.5 transition-colors duration-200 safe-top">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
        {/* Left: Mobile Menu Toggle & Brand */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Hamburger Menu Toggle (Visible only on mobile/tablet screens < 768px) */}
          <button
            onClick={onToggleMobileMenu}
            className="md:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5 text-indigo-600 dark:text-indigo-400" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-700 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 shrink-0">
            <Wallet className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight leading-none">
                SmartSpend
              </h1>
              <span
                className={`text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded-full border ${isAdmin
                  ? 'bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800'
                  : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                  }`}
              >
                {isAdmin ? 'Admin' : 'Personal'}
              </span>
            </div>
            <p className="text-[10px] sm:text-xs text-slate-400 dark:text-slate-500 font-medium hidden sm:block">
              {isAdmin ? 'System & User Directory Management' : `${user?.name} • ${user?.profession || 'User'}`}
            </p>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          {/* Month Selector: Only for regular user */}
          {!isAdmin && (
            <div className="flex items-center gap-1 bg-slate-100/90 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2 sm:px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200">
              <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0 hidden sm:inline" />
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="bg-transparent border-none text-[11px] sm:text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-none cursor-pointer"
                aria-label="Select finance month"
              >
                {availableMonths.map((m) => (
                  <option key={m} value={m} className="bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100">
                    {formatMonthYear(m)}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Dynamic Currency Switcher */}
          <div
            className="flex items-center gap-1 bg-slate-100/90 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2 py-1.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200"
            title="Switch Active Currency"
          >
            <Coins className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <select
              value={user?.currency || 'USD'}
              onChange={handleCurrencyChange}
              className="bg-transparent border-none text-[11px] sm:text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-none cursor-pointer"
              aria-label="Select currency"
            >
              {SUPPORTED_CURRENCIES.map((c) => (
                <option key={c.code} value={c.code} className="bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100">
                  {c.code}
                </option>
              ))}
            </select>
          </div>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition shrink-0"
            title={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
            aria-label="Toggle dark/light theme"
          >
            {isDark ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-indigo-600" />
            )}
          </button>

          {/* Smart Alerts Bell Notification (User Only) */}
          {!isAdmin && (
            <div className="relative">
              <button
                onClick={() => setShowAlertsDropdown(!showAlertsDropdown)}
                className="relative p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                aria-label="View notifications and alerts"
              >
                <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
                {alerts.length > 0 && (
                  <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-sm ring-2 ring-white dark:ring-slate-900">
                    {alerts.length}
                  </span>
                )}
              </button>

              {/* Alerts Dropdown */}
              {showAlertsDropdown && (
                <div className="absolute right-0 mt-2 w-72 sm:w-96 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800 px-2">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-500" />
                      <span className="font-semibold text-xs text-slate-800 dark:text-slate-100">
                        Smart Alerts ({alerts.length})
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        setShowAlertsDropdown(false);
                        setActiveTab('alerts');
                      }}
                      className="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold hover:underline flex items-center gap-1"
                    >
                      View All <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="py-2 max-h-72 overflow-y-auto space-y-2">
                    {alerts.length === 0 ? (
                      <div className="text-center py-6 text-slate-400 text-xs">
                        <CheckCircle2 className="w-8 h-8 mx-auto mb-1 text-emerald-400" />
                        All budgets within healthy thresholds!
                      </div>
                    ) : (
                      alerts.map((alert) => (
                        <div
                          key={alert.id}
                          onClick={() => {
                            setShowAlertsDropdown(false);
                            setActiveTab('alerts');
                          }}
                          className={`p-2.5 rounded-2xl border text-xs cursor-pointer transition ${alert.type === 'CRITICAL'
                            ? 'bg-rose-50/70 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900/60'
                            : 'bg-amber-50/70 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900/60'
                            }`}
                        >
                          <div className="font-semibold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                            <span>{alert.title}</span>
                            <span
                              className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${alert.type === 'CRITICAL' ? 'bg-rose-200 text-rose-800' : 'bg-amber-200 text-amber-800'
                                }`}
                            >
                              {alert.percentage}%
                            </span>
                          </div>
                          <p className="text-slate-600 dark:text-slate-400 mt-1 line-clamp-2">{alert.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* User Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-1.5 sm:gap-2.5 p-1 sm:p-1.5 sm:pl-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition"
              aria-label="User account menu"
            >
              <div className="text-left hidden lg:block">
                <div className="text-xs font-bold text-slate-800 dark:text-slate-100 leading-tight flex items-center gap-1.5">
                  {user?.name || 'User'}
                  {isAdmin && (
                    <span className="text-[10px] bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 font-semibold px-1.5 py-0.2 rounded">
                      Admin
                    </span>
                  )}
                </div>
                <div className="text-[10px] text-slate-400 dark:text-slate-500 leading-none">
                  {user?.profession || user?.email}
                </div>
              </div>
              <img
                src={user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || 'User'}`}
                alt="Avatar"
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl object-cover ring-1 ring-slate-200 dark:ring-slate-700"
              />
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl mb-2">
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-100">{user?.name}</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">{user?.email}</div>
                  <div className="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold mt-0.5 flex items-center gap-1">
                    <Briefcase className="w-3 h-3" />
                    <span>{user?.profession || 'Professional'}</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-[11px]">
                    <span className="text-slate-500 dark:text-slate-400">Role Authority:</span>
                    <span
                      className={`font-mono font-bold px-2 py-0.5 rounded border ${isAdmin
                        ? 'text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/40 border-purple-200 dark:border-purple-800'
                        : 'text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-800'
                        }`}
                    >
                      {user?.role}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    onOpenGuide();
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 flex items-center gap-2"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Backend Config</span>
                </button>

                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    logout();
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center gap-2 transition"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>

          {/* Direct Sign Out Button */}
          <button
            onClick={logout}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-950/60 text-rose-700 dark:text-rose-300 text-xs font-semibold rounded-xl border border-rose-200 dark:border-rose-900/50 transition shrink-0"
            title="Log out and return to Login Page"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </div>
    </header>
  );
};
