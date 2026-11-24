import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { SUPPORTED_CURRENCIES } from '../../utils/formatters';
import { User, Mail, Lock, Briefcase, Image as ImageIcon, UserPlus, Eye, EyeOff, Coins } from 'lucide-react';

export const RegisterModal = ({ isOpen, onClose, onSwitchToLogin }) => {
  const { register } = useAuth();
  const { success, error } = useToast();

  const popularProfessions = [
    'Software Engineer',
    'UI/UX Designer',
    'Product Manager',
    'Data Analyst',
    'Marketing Lead',
    'Financial Consultant',
    'Doctor',
    'Student',
  ];

  const [selectedProfessionOption, setSelectedProfessionOption] = useState('Software Engineer');
  const [customProfession, setCustomProfession] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    profession: 'Software Engineer',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    role: 'ROLE_USER',
    currency: 'USD',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      error('Passwords do not match.');
      return;
    }
    if (formData.password.length < 6) {
      error('Password should be at least 6 characters long.');
      return;
    }

    try {
      setIsSubmitting(true);
      const finalProfession = selectedProfessionOption === 'OTHER'
        ? customProfession.trim()
        : selectedProfessionOption;

      if (!finalProfession) {
        error('Please enter your custom profession in the text box.');
        return;
      }

      const newUser = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        profession: finalProfession,
        avatar: formData.avatar,
        role: 'ROLE_USER',
        currency: formData.currency,
      });
      success(`Registration successful! Welcome, ${newUser.name}.`);
      onClose();
    } catch (err) {
      error(err.message || 'Registration failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Account" maxWidth="max-w-md">
      <form onSubmit={handleSubmit} className="space-y-3.5">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Full Name
          </label>
          <div className="relative">
            <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Jordan Lee"
              className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Email Address
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="jordan@example.com"
              className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Profession / Title */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Profession / Title
            </label>
            <span className="text-[11px] text-slate-400">
              {selectedProfessionOption === 'OTHER' ? 'Custom title required' : 'Select from suggestions or choose Other'}
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5 mb-2">
            {popularProfessions.map((p) => {
              const isSelected = selectedProfessionOption === p;
              return (
                <button
                  key={p}
                  type="button"
                  onClick={() => {
                    setSelectedProfessionOption(p);
                    setFormData({ ...formData, profession: p });
                  }}
                  className={`text-[11px] font-medium px-2 py-0.5 rounded-lg border transition ${
                    isSelected
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {p}
                </button>
              );
            })}
            <button
              type="button"
              onClick={() => {
                setSelectedProfessionOption('OTHER');
                setFormData({ ...formData, profession: customProfession });
              }}
              className={`text-[11px] font-medium px-2 py-0.5 rounded-lg border transition ${
                selectedProfessionOption === 'OTHER'
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200'
              }`}
            >
              + Other
            </button>
          </div>

          {selectedProfessionOption === 'OTHER' && (
            <div className="relative animate-in fade-in duration-150 mb-2">
              <Briefcase className="w-4 h-4 text-indigo-500 absolute left-3 top-2.5" />
              <input
                type="text"
                required
                value={customProfession}
                onChange={(e) => {
                  setCustomProfession(e.target.value);
                  setFormData({ ...formData, profession: e.target.value });
                }}
                placeholder="Type your custom profession..."
                className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-indigo-300 dark:border-indigo-600 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                autoFocus
              />
            </div>
          )}
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Default Currency
          </label>
          <div className="relative">
            <Coins className="w-4 h-4 text-amber-500 absolute left-3.5 top-2.5" />
            <select
              name="currency"
              value={formData.currency}
              onChange={handleChange}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-xl text-xs font-semibold focus:outline-none focus:border-indigo-500"
            >
              {SUPPORTED_CURRENCIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.code} ({c.symbol}) — {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Photo / Avatar URL
          </label>
          <div className="relative">
            <ImageIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="url"
              name="avatar"
              value={formData.avatar}
              onChange={handleChange}
              placeholder="https://images.unsplash.com/..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Password
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              placeholder="At least 6 characters"
              className="w-full pl-10 pr-10 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Confirm Password
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type={showPassword ? 'text' : 'password'}
              name="confirmPassword"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Re-enter password"
              className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl shadow-md shadow-indigo-600/25 transition flex items-center justify-center gap-2 mt-4 disabled:opacity-50"
        >
          <UserPlus className="w-4 h-4" />
          <span>{isSubmitting ? 'Creating Standard Account...' : 'Create Standard Account'}</span>
        </button>

        <div className="text-center text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
          Already registered?{' '}
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
          >
            Sign In
          </button>
        </div>
      </form>
    </Modal>
  );
};
