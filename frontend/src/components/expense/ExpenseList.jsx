import React, { useState, useMemo } from 'react';
import { useData } from '../../context/DataContext';
import { ExpenseFormModal } from './ExpenseFormModal';
import { formatCurrency, formatDate, EXPENSE_CATEGORIES, PAYMENT_METHODS } from '../../utils/formatters';
import {
  Plus,
  Search,
  Filter,
  ArrowUpRight,
  Edit2,
  Trash2,
  CreditCard,
  Tag,
  Download,
} from 'lucide-react';
import { exportTransactionsToCSV } from '../../utils/exportUtils';

export const ExpenseList = () => {
  const { expenses, addExpense, updateExpense, deleteExpense, selectedMonth } = useData();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedPayment, setSelectedPayment] = useState('ALL');
  const [sortBy, setSortBy] = useState('date-desc');

  // Filter & Sort
  const filteredExpenses = useMemo(() => {
    return expenses
      .filter((exp) => {
        const matchesMonth = !selectedMonth || (exp.date && exp.date.startsWith(selectedMonth));
        const matchesCategory = selectedCategory === 'ALL' || exp.category === selectedCategory;
        const matchesPayment = selectedPayment === 'ALL' || exp.paymentMethod === selectedPayment;
        const matchesQuery =
          !searchQuery ||
          exp.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          exp.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          exp.tags?.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesMonth && matchesCategory && matchesPayment && matchesQuery;
      })
      .sort((a, b) => {
        if (sortBy === 'date-desc') return new Date(b.date) - new Date(a.date);
        if (sortBy === 'date-asc') return new Date(a.date) - new Date(b.date);
        if (sortBy === 'amount-desc') return b.amount - a.amount;
        if (sortBy === 'amount-asc') return a.amount - b.amount;
        return 0;
      });
  }, [expenses, selectedMonth, selectedCategory, selectedPayment, searchQuery, sortBy]);

  const totalFilteredExpense = useMemo(() => {
    return filteredExpenses.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
  }, [filteredExpenses]);

  const handleOpenAdd = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleSave = async (formData) => {
    if (editingItem) {
      await updateExpense(editingItem.id, formData);
    } else {
      await addExpense(formData);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm transition-colors">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/50">
              <ArrowUpRight className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Expense Management</h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Record, categorize, and control your daily expenditures.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right mr-2">
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Total Spent
            </div>
            <div className="text-xl font-bold text-rose-600 dark:text-rose-400">
              {formatCurrency(totalFilteredExpense)}
            </div>
          </div>

          <button
            onClick={() => exportTransactionsToCSV([], filteredExpenses, `expenses-${selectedMonth}.csv`)}
            className="flex items-center gap-1.5 px-3 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs rounded-xl border border-slate-200 dark:border-slate-700 transition"
            title="Export filtered expenses to CSV"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">CSV</span>
          </button>

          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-2 px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs rounded-xl shadow-md shadow-rose-600/25 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Record Expense</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm transition-colors">
        <div className="md:col-span-4 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search description or tags..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
          />
        </div>

        <div className="md:col-span-3 relative">
          <Filter className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 rounded-xl text-xs font-medium focus:outline-none focus:border-rose-500"
          >
            <option value="ALL">All Categories</option>
            {EXPENSE_CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-3">
          <select
            value={selectedPayment}
            onChange={(e) => setSelectedPayment(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 rounded-xl text-xs font-medium focus:outline-none focus:border-rose-500"
          >
            <option value="ALL">All Payment Methods</option>
            {PAYMENT_METHODS.map((pm) => (
              <option key={pm} value={pm}>
                {pm}
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-2">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 rounded-xl text-xs font-medium focus:outline-none focus:border-rose-500"
          >
            <option value="date-desc">Newest Date</option>
            <option value="date-asc">Oldest Date</option>
            <option value="amount-desc">Highest Cost</option>
            <option value="amount-asc">Lowest Cost</option>
          </select>
        </div>
      </div>

      {/* Expense Records Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden transition-colors">
        {filteredExpenses.length === 0 ? (
          <div className="p-12 text-center">
            <ArrowUpRight className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600 mb-2" />
            <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300">No expense records found</h4>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
              Log an expense or adjust the filters.
            </p>
          </div>
        ) : (
          <div className="responsive-table-container overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/70 dark:bg-slate-800/60 border-b border-slate-200/80 dark:border-slate-800 text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Description</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Payment Method</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Tags</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {filteredExpenses.map((item) => {
                  const catConfig = EXPENSE_CATEGORIES.find((c) => c.name === item.category);

                  return (
                    <tr key={item.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition">
                      <td className="py-3.5 px-4 font-semibold">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-semibold border ${
                            catConfig?.bg || 'bg-slate-50 text-slate-700 border-slate-200'
                          }`}
                        >
                          {item.category}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-medium text-slate-900 dark:text-slate-100 max-w-xs truncate">
                        {item.description}
                      </td>
                      <td className="py-3.5 px-4 text-sm font-bold text-rose-600 dark:text-rose-400 whitespace-nowrap">
                        -{formatCurrency(item.amount)}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1.5 text-slate-500 dark:text-slate-400 font-medium">
                          <CreditCard className="w-3.5 h-3.5 text-slate-400" />
                          {item.paymentMethod || 'Card'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300 font-medium whitespace-nowrap">
                        {formatDate(item.date)}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex flex-wrap gap-1">
                          {item.tags?.map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-semibold"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenEdit(item)}
                            className="p-1.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 rounded-lg transition"
                            title="Edit Expense"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm('Delete this expense?')) {
                                deleteExpense(item.id);
                              }
                            }}
                            className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition"
                            title="Delete Expense"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ExpenseFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        editingExpense={editingItem}
      />
    </div>
  );
};
