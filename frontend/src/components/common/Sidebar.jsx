import React from 'react';
import {
  LayoutDashboard,
  ArrowDownLeft,
  ArrowUpRight,
  Target,
  BarChart3,
  Bell,
  FileSpreadsheet,
  ShieldCheck,
  Users,
  Code2,
  X,
  Menu,
  Wallet,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';

export const Sidebar = ({
  activeTab,
  setActiveTab,
  onOpenGuide,
  isMobileOpen = false,
  onCloseMobile = () => {},
  onOpenMobile = () => {},
}) => {
  const { isAdmin } = useAuth();
  const { alerts } = useData();

  // Navigation Items
  const userNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'income', label: 'Income Management', icon: ArrowDownLeft, color: 'text-emerald-500' },
    { id: 'expenses', label: 'Expense Management', icon: ArrowUpRight, color: 'text-rose-500' },
    { id: 'budget', label: 'Budget Management', icon: Target, color: 'text-indigo-500' },
    { id: 'analytics', label: 'Expense Analytics', icon: BarChart3, color: 'text-purple-500' },
    {
      id: 'alerts',
      label: 'Smart Alerts',
      icon: Bell,
      color: 'text-amber-500',
      badge: alerts.length > 0 ? alerts.length : null,
    },
    { id: 'reports', label: 'Monthly Reports', icon: FileSpreadsheet, color: 'text-sky-500' },
  ];

  // Mobile Bottom Bar primary items (for swift one-thumb mobile access)
  const mobileQuickItems = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'income', label: 'Income', icon: ArrowDownLeft, color: 'text-emerald-500' },
    { id: 'expenses', label: 'Expenses', icon: ArrowUpRight, color: 'text-rose-500' },
    { id: 'budget', label: 'Budget', icon: Target, color: 'text-indigo-500' },
  ];

  const handleSelectTab = (tabId) => {
    setActiveTab(tabId);
    onCloseMobile();
  };

  // Reusable Nav Content
  const renderNavContent = (isDrawer = false) => {
    if (isAdmin) {
      return (
        <div className="flex flex-col justify-between h-full">
          <div>
            {isDrawer && (
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-purple-600 flex items-center justify-center text-white">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <span className="font-bold text-sm text-slate-900 dark:text-white">Admin Control</span>
                </div>
                <button
                  onClick={onCloseMobile}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  aria-label="Close navigation"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}

            <div className="text-[11px] font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider px-3 mb-2 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin Control</span>
            </div>

            <nav className="space-y-1">
              <button
                onClick={() => handleSelectTab('admin')}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-2xl text-sm font-bold bg-purple-600 text-white shadow-md shadow-purple-600/20"
              >
                <div className="flex items-center gap-3">
                  <Users className="w-4 h-4 text-white" />
                  <span>User Management</span>
                </div>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-white text-purple-700">
                  Admin
                </span>
              </button>
            </nav>

            <div className="mt-6 p-4 rounded-3xl bg-purple-50/70 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-900/50 text-xs text-purple-900 dark:text-purple-200 leading-relaxed">
              <p className="font-semibold text-purple-950 dark:text-purple-100 mb-1">Admin Portal Scope</p>
              Oversee user identities, roles, and user directory management across the platform.
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 text-[11px] text-slate-500 dark:text-slate-400">
              Platform Engine: Spring Boot 3 &amp; MySQL 8
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="flex flex-col justify-between h-full">
        <div>
          {isDrawer && (
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white">
                  <Wallet className="w-4 h-4" />
                </div>
                <span className="font-bold text-sm text-slate-900 dark:text-white">SmartSpend Menu</span>
              </div>
              <button
                onClick={onCloseMobile}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                aria-label="Close navigation drawer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          )}

          <div className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-3 mb-2">
            Personal Finances
          </div>

          <nav className="space-y-1">
            {userNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-2xl text-sm font-semibold transition-all ${isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/60'
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-4 h-4 ${isActive ? 'text-white' : item.color || 'text-slate-400'}`}
                    />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${isActive
                        ? 'bg-white text-indigo-700'
                        : item.id === 'alerts'
                          ? 'bg-rose-500 text-white'
                          : 'bg-purple-100 text-purple-700'
                        }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Backend Box */}
        <div className="mt-8 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-indigo-50 to-violet-50/80 dark:from-slate-800/80 dark:to-indigo-950/40 border border-indigo-100/80 dark:border-slate-700/80">
            <div className="flex items-center gap-2 mb-1">
              <Code2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span className="text-xs font-bold text-indigo-950 dark:text-indigo-200">MySQL &amp; REST Backend</span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed mb-2.5">
              Personal data isolation active. Only your records are displayed.
            </p>
            <button
              onClick={() => {
                onCloseMobile();
                onOpenGuide();
              }}
              className="w-full text-center py-1.5 px-2 bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-semibold rounded-xl shadow-sm transition"
            >
              Connection Settings
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* 1. Desktop Sticky Left Sidebar (Visible on screens >= 768px: md:) */}
      <aside className="hidden md:flex flex-col w-64 bg-white dark:bg-slate-900 border-r border-slate-200/80 dark:border-slate-800 p-4 shrink-0 transition-colors duration-200 desktop-sticky-sidebar">
        {renderNavContent(false)}
      </aside>

      {/* 2. Mobile Drawer Backdrop & Slide-out Menu (Visible when isMobileOpen is true on < 768px) */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex animate-in fade-in duration-200">
          {/* Backdrop overlay */}
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity"
            onClick={onCloseMobile}
            aria-hidden="true"
          />

          {/* Drawer container */}
          <div className="relative w-72 max-w-[85vw] bg-white dark:bg-slate-900 h-full p-4 shadow-2xl flex flex-col z-10 overflow-y-auto animate-in slide-in-from-left duration-200 safe-top safe-bottom">
            {renderNavContent(true)}
          </div>
        </div>
      )}

      {/* 3. Mobile Dock / Bottom Navigation Bar (Visible on mobile screens < 768px for regular users) */}
      {!isAdmin && (
        <nav
          className="md:hidden fixed bottom-0 inset-x-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200/80 dark:border-slate-800 px-2 py-1.5 flex items-center justify-around safe-bottom shadow-lg transition-colors"
          aria-label="Mobile quick navigation"
        >
          {mobileQuickItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleSelectTab(item.id)}
                className={`flex flex-col items-center justify-center flex-1 py-1 rounded-xl transition ${
                  isActive
                    ? 'text-indigo-600 dark:text-indigo-400 font-bold'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-indigo-600 dark:text-indigo-400' : ''}`} />
                <span className="text-[10px] mt-0.5 leading-none">{item.label}</span>
              </button>
            );
          })}

          {/* "More / Menu" button opens the full drawer */}
          <button
            onClick={onOpenMobile}
            className={`flex flex-col items-center justify-center flex-1 py-1 rounded-xl transition ${
              isMobileOpen || !mobileQuickItems.some((i) => i.id === activeTab)
                ? 'text-indigo-600 dark:text-indigo-400 font-bold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <div className="relative">
              <Menu className="w-5 h-5" />
              {alerts.length > 0 && (
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-900" />
              )}
            </div>
            <span className="text-[10px] mt-0.5 leading-none">More</span>
          </button>
        </nav>
      )}
    </>
  );
};
