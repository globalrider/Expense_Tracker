import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { EXPENSE_CATEGORIES, getCurrencySymbol } from '../../utils/formatters';
import { useAuth } from '../../context/AuthContext';
import { Target, Calendar } from 'lucide-react';

export const BudgetModal = ({ isOpen, onClose, onSave, editingBudget = null, defaultCategory = null, month }) => {
  const { user } = useAuth();
  const currencySymbol = getCurrencySymbol(user?.currency || 'USD');
  const [category, setCategory] = useState('Food & Dining');
  const [limit, setLimit] = useState('');

  useEffect(() => {
    if (editingBudget) {
      setCategory(editingBudget.category);
      setLimit(editingBudget.limit);
    } else if (defaultCategory) {
      setCategory(defaultCategory);
      setLimit('');
    } else {
      setCategory('Food & Dining');
      setLimit('');
    }
  }, [editingBudget, defaultCategory, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!limit || parseFloat(limit) <= 0) return;

    onSave(category, parseFloat(limit), month);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingBudget ? `Adjust Budget for ${category}` : 'Set Monthly Category Budget'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Category
          </label>
          <div className="relative">
            <Target className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <select
              value={category}
              disabled={!!editingBudget}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 rounded-xl text-sm font-medium focus:outline-none focus:border-indigo-500 disabled:opacity-75 disabled:cursor-not-allowed"
            >
              {EXPENSE_CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Monthly Limit ({currencySymbol})
          </label>
          <div className="relative">
            <span className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 font-bold text-xs flex items-center justify-center">
              {currencySymbol}
            </span>
            <input
              type="number"
              step="10"
              min="1"
              required
              value={limit}
              onChange={(e) => setLimit(e.target.value)}
              placeholder="e.g. 500"
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            You will receive a smart alert if spending reaches your threshold.
          </p>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/25 transition"
          >
            Save Limit
          </button>
        </div>
      </form>
    </Modal>
  );
};
