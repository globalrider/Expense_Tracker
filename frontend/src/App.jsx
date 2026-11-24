import React, { useState } from 'react';
import { ToastProvider } from './context/ToastContext';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider, useData } from './context/DataContext';

import { Navbar } from './components/common/Navbar';
import { Sidebar } from './components/common/Sidebar';

import { DashboardOverview } from './components/dashboard/DashboardOverview';
import { IncomeList } from './components/income/IncomeList';
import { IncomeFormModal } from './components/income/IncomeFormModal';

import { ExpenseList } from './components/expense/ExpenseList';
import { ExpenseFormModal } from './components/expense/ExpenseFormModal';

import { BudgetOverview } from './components/budget/BudgetOverview';
import { BudgetModal } from './components/budget/BudgetModal';

import { SpendingAnalytics } from './components/analytics/SpendingAnalytics';
import { AlertsList } from './components/alerts/AlertsList';
import { MonthlyReportView } from './components/reports/MonthlyReportView';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { LoginPage } from './components/auth/LoginPage';
import { SpringBootGuideModal } from './components/backend/SpringBootGuideModal';

const MainAppContent = () => {
  const { user, isAuthenticated, isAdmin } = useAuth();
  const { addIncome, addExpense, saveBudget, selectedMonth } = useData();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Modals state
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isIncomeModalOpen, setIsIncomeModalOpen] = useState(false);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);

  // If not authenticated, display the dedicated Login Page!
  if (!isAuthenticated || !user) {
    return <LoginPage />;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      {/* Top Header */}
      <Navbar
        onOpenGuide={() => setIsGuideOpen(true)}
        setActiveTab={setActiveTab}
        isMobileMenuOpen={isMobileMenuOpen}
        onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      />

      {/* Main Layout Area */}
      <div className="flex-1 max-w-7xl w-full mx-auto flex flex-col md:flex-row">
        {/* Navigation Sidebar (Desktop sticky + Mobile slide drawer + Mobile dock) */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenGuide={() => setIsGuideOpen(true)}
          isMobileOpen={isMobileMenuOpen}
          onCloseMobile={() => setIsMobileMenuOpen(false)}
          onOpenMobile={() => setIsMobileMenuOpen(true)}
        />

        {/* Dynamic Content Panel with mobile bottom spacing */}
        <main className="flex-1 p-3 sm:p-6 lg:p-8 overflow-y-auto mobile-bottom-space">
          {/* Admin Mode: Only User Directory & User Management */}
          {isAdmin ? (
            <AdminDashboard />
          ) : (
            <>
              {activeTab === 'dashboard' && (
                <DashboardOverview
                  setActiveTab={setActiveTab}
                  onOpenIncomeModal={() => setIsIncomeModalOpen(true)}
                  onOpenExpenseModal={() => setIsExpenseModalOpen(true)}
                  onOpenBudgetModal={() => setIsBudgetModalOpen(true)}
                />
              )}

              {activeTab === 'income' && <IncomeList />}

              {activeTab === 'expenses' && <ExpenseList />}

              {activeTab === 'budget' && <BudgetOverview />}

              {activeTab === 'analytics' && <SpendingAnalytics />}

              {activeTab === 'alerts' && <AlertsList setActiveTab={setActiveTab} />}

              {activeTab === 'reports' && <MonthlyReportView />}
            </>
          )}
        </main>
      </div>

      {/* Spring Boot Guide Modal */}
      <SpringBootGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />

      {/* Quick Add Incomes Modal (User only) */}
      {!isAdmin && (
        <>
          <IncomeFormModal
            isOpen={isIncomeModalOpen}
            onClose={() => setIsIncomeModalOpen(false)}
            onSave={(data) => addIncome(data)}
          />

          <ExpenseFormModal
            isOpen={isExpenseModalOpen}
            onClose={() => setIsExpenseModalOpen(false)}
            onSave={(data) => addExpense(data)}
          />

          <BudgetModal
            isOpen={isBudgetModalOpen}
            onClose={() => setIsBudgetModalOpen(false)}
            onSave={(category, limit, month) => saveBudget(category, limit, month)}
            month={selectedMonth}
          />
        </>
      )}
    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <DataProvider>
            <MainAppContent />
          </DataProvider>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}
