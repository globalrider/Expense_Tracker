import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../context/ToastContext';
import {
  Wallet,
  Mail,
  Lock,
  User,
  ShieldCheck,
  Eye,
  EyeOff,
  Sun,
  Moon,
  Briefcase,
  Camera,
  UserCheck,
  UserPlus,
  AlertCircle,
  KeyRound,
  Coins,
} from 'lucide-react';
import { SUPPORTED_CURRENCIES } from '../../utils/formatters';

export const LoginPage = () => {
  const { login, register } = useAuth();
  const { theme, toggleTheme, isDark } = useTheme();
  const { success, error } = useToast();

  // Role selector: 'USER' or 'ADMIN'
  const [selectedRole, setSelectedRole] = useState('USER');
  const [isRegisterMode, setIsRegisterMode] = useState(false);

  // User login/registration state
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [name, setName] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [selectedProfessionOption, setSelectedProfessionOption] = useState('Software Engineer');
  const [customProfession, setCustomProfession] = useState('');
  const [avatar, setAvatar] = useState('https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80');

  // Admin credentials state (strictly itachi / itachi@gmail.com / itachi@1313)
  const [adminUsername, setAdminUsername] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Preset Avatar choices for user registration
  const presetAvatars = [
    { url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80', label: 'Avatar 1' },
    { url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80', label: 'Avatar 2' },
    { url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', label: 'Avatar 3' },
    { url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80', label: 'Avatar 4' },
    { url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80', label: 'Avatar 5' },
    { url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80', label: 'Avatar 6' },
  ];

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

  const handleRoleChange = (role) => {
    setSelectedRole(role);
    if (role === 'ADMIN') {
      setIsRegisterMode(false); // Admin cannot be registered
    }
  };

  const handleAdminLogin = async (e) => {
    e.preventDefault();

    const trimmedUsername = adminUsername.trim();
    const trimmedEmail = adminEmail.trim().toLowerCase();

    // Strict validation: Only itachi / itachi@gmail.com / itachi@1313
    if (
      trimmedUsername !== 'itachi' ||
      trimmedEmail !== 'itachi@gmail.com' ||
      adminPassword !== 'itachi@1313'
    ) {
      error(
        "Access denied: Invalid administrator credentials. Only username 'itachi', email 'itachi@gmail.com', and password 'itachi@1313' can access admin features."
      );
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await login(trimmedEmail, adminPassword, trimmedUsername, 'ROLE_ADMIN');
      if (res.role !== 'ROLE_ADMIN') {
        throw new Error('Access denied: Account does not have administrator privileges.');
      }
      success('Welcome Administrator Itachi! Access granted to Admin Portal.');
    } catch (err) {
      error(err.message || 'Administrator authentication failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUserAuth = async (e) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);

      if (isRegisterMode) {
        if (!name.trim()) {
          error('Please enter your full name.');
          return;
        }

        const finalProfession =
          selectedProfessionOption === 'OTHER'
            ? customProfession.trim()
            : selectedProfessionOption;

        if (!finalProfession) {
          error('Please enter your custom profession in the text box.');
          return;
        }

        // Strictly creates standard ROLE_USER
        const newUser = await register({
          name: name.trim(),
          email: userEmail.trim().toLowerCase(),
          password: userPassword,
          profession: finalProfession,
          avatar,
          role: 'ROLE_USER',
          currency: selectedCurrency,
        });
        success(`Account created successfully! Welcome, ${newUser.name}.`);
      } else {
        const loggedUser = await login(userEmail.trim().toLowerCase(), userPassword, null, 'ROLE_USER');
        success(`Welcome back, ${loggedUser.name}!`);
      }
    } catch (err) {
      error(err.message || 'Authentication failed. Please verify your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col justify-between transition-colors duration-200">
      {/* Top Navbar */}
      <header className="border-b border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-700 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/25 shrink-0">
            <Wallet className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight leading-none">
              SmartSpend
            </h1>
            <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">
              Enterprise Expense &amp; Budget Tracker
            </span>
          </div>
        </div>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition"
          title={`Switch to ${isDark ? 'Light' : 'Dark'} Theme`}
        >
          {isDark ? (
            <>
              <Sun className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline">Light Theme</span>
            </>
          ) : (
            <>
              <Moon className="w-4 h-4 text-indigo-600" />
              <span className="hidden sm:inline">Dark Theme</span>
            </>
          )}
        </button>
      </header>

      {/* Main Login / Register Body */}
      <main className="max-w-lg w-full mx-auto px-4 py-8 flex-1 flex flex-col justify-center">
        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 animate-in fade-in duration-200">
          {/* Role Switcher Tabs */}
          <div className="mb-6">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2 text-center">
              Select Login Role
            </label>
            <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-100 dark:bg-slate-800/80 rounded-2xl border border-slate-200/80 dark:border-slate-700">
              <button
                type="button"
                onClick={() => handleRoleChange('USER')}
                className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition ${
                  selectedRole === 'USER'
                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <User className="w-4 h-4" />
                <span>Regular User</span>
              </button>

              <button
                type="button"
                onClick={() => handleRoleChange('ADMIN')}
                className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition ${
                  selectedRole === 'ADMIN'
                    ? 'bg-purple-600 text-white shadow-sm shadow-purple-600/30'
                    : 'text-slate-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                <span>System Admin</span>
              </button>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* ADMIN LOGIN FORM (Strictly itachi / itachi@gmail.com / itachi@1313)        */}
          {/* ========================================================================= */}
          {selectedRole === 'ADMIN' && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <div className="text-center pb-2 border-b border-slate-100 dark:border-slate-800">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-300 mb-2 shadow-inner">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  Administrator Portal
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Enter authorized administrator credentials to manage user directory &amp; permissions.
                </p>
              </div>

              <form onSubmit={handleAdminLogin} className="space-y-4">
                {/* Admin Username */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Admin Username
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-purple-500 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      required
                      value={adminUsername}
                      onChange={(e) => setAdminUsername(e.target.value)}
                      placeholder="e.g. itachi"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition font-mono"
                    />
                  </div>
                </div>

                {/* Admin Gmail */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Admin Gmail / Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-purple-500 absolute left-3.5 top-3" />
                    <input
                      type="email"
                      required
                      value={adminEmail}
                      onChange={(e) => setAdminEmail(e.target.value)}
                      placeholder="itachi@gmail.com"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition font-mono"
                    />
                  </div>
                </div>

                {/* Admin Password */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Admin Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-purple-500 absolute left-3.5 top-3" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      placeholder="Enter administrator password"
                      className="w-full pl-10 pr-10 py-2.5 bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Submit Admin Login */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 px-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold text-sm rounded-xl shadow-md shadow-purple-600/25 transition flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
                >
                  <KeyRound className="w-4 h-4" />
                  <span>{isSubmitting ? 'Verifying Admin Authority...' : 'Access Admin Portal'}</span>
                </button>
              </form>

              {/* No public creation note */}
              <div className="p-3 rounded-xl bg-purple-50/70 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-900/40 text-[11px] text-purple-800 dark:text-purple-300 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Restricted Authority:</strong> New administrator accounts cannot be created publicly. Only the authorized administrator account can access administrative functions.
                </span>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* REGULAR USER LOGIN & REGISTRATION FORM                                    */}
          {/* ========================================================================= */}
          {selectedRole === 'USER' && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <div className="text-center pb-2 border-b border-slate-100 dark:border-slate-800">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 mb-2 shadow-inner">
                  {isRegisterMode ? <UserPlus className="w-6 h-6" /> : <UserCheck className="w-6 h-6" />}
                </div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  {isRegisterMode ? 'Create User Account' : 'User Finance Portal'}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {isRegisterMode
                    ? 'Register your profile to manage your expenses and budget'
                    : 'Sign in to access your personal transactions, budgets, and analytics'}
                </p>
              </div>

              <form onSubmit={handleUserAuth} className="space-y-4">
                {/* Registration Fields */}
                {isRegisterMode && (
                  <>
                    {/* Full Name */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Full Name
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="e.g. Jordan Lee"
                          className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                        />
                      </div>
                    </div>

                    {/* Profession / Job Title Selection */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                          Profession / Job Title
                        </label>
                        <span className="text-[11px] text-slate-400 dark:text-slate-500">
                          {selectedProfessionOption === 'OTHER' ? 'Custom title required' : 'Choose suggested or Other'}
                        </span>
                      </div>

                      {/* Suggested profession pills */}
                      <div className="flex flex-wrap gap-1.5 mb-2.5">
                        {popularProfessions.map((p) => {
                          const isSelected = selectedProfessionOption === p;
                          return (
                            <button
                              key={p}
                              type="button"
                              onClick={() => {
                                setSelectedProfessionOption(p);
                              }}
                              className={`text-xs font-medium px-2.5 py-1 rounded-xl border transition ${
                                isSelected
                                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm shadow-indigo-500/20'
                                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700'
                              }`}
                            >
                              {p}
                            </button>
                          );
                        })}

                        {/* "+ Other" option */}
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedProfessionOption('OTHER');
                          }}
                          className={`text-xs font-medium px-2.5 py-1 rounded-xl border transition ${
                            selectedProfessionOption === 'OTHER'
                              ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm shadow-indigo-500/20'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700'
                          }`}
                        >
                          + Other (Not in list)
                        </button>
                      </div>

                      {/* Text Box appears ONLY if profession is not one of the suggested ones */}
                      {selectedProfessionOption === 'OTHER' && (
                        <div className="relative animate-in fade-in slide-in-from-top-1 duration-150">
                          <Briefcase className="w-4 h-4 text-indigo-500 absolute left-3.5 top-3" />
                          <input
                            type="text"
                            required
                            value={customProfession}
                            onChange={(e) => setCustomProfession(e.target.value)}
                            placeholder="Type your custom profession (e.g. Civil Engineer, Teacher, Pilot...)"
                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/70 border border-indigo-300 dark:border-indigo-600 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                            autoFocus
                          />
                        </div>
                      )}
                    </div>

                    {/* Photo / Avatar Section */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Profile Photo / Avatar
                      </label>

                      <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700">
                        <img
                          src={avatar}
                          alt="Preview"
                          className="w-12 h-12 rounded-2xl object-cover ring-2 ring-indigo-500 shadow-md shrink-0"
                          onError={(e) => {
                            e.target.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name || 'User')}`;
                          }}
                        />
                        <div className="flex-1 min-w-0">
                          <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                            Choose Preset Photo or Enter URL:
                          </span>
                          <div className="flex items-center gap-1.5">
                            {presetAvatars.map((pa, idx) => (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => setAvatar(pa.url)}
                                className={`w-6 h-6 rounded-lg overflow-hidden border-2 transition ${
                                  avatar === pa.url
                                    ? 'border-indigo-600 ring-2 ring-indigo-500/40 scale-105'
                                    : 'border-slate-200 dark:border-slate-700 opacity-70 hover:opacity-100'
                                }`}
                              >
                                <img src={pa.url} alt={pa.label} className="w-full h-full object-cover" />
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="relative mt-2">
                        <Camera className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
                        <input
                          type="url"
                          value={avatar}
                          onChange={(e) => setAvatar(e.target.value)}
                          placeholder="Custom photo URL (e.g. https://...)"
                          className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-indigo-500 font-mono"
                        />
                      </div>
                    </div>

                    {/* Preferred Currency */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Preferred Currency
                      </label>
                      <div className="relative">
                        <Coins className="w-4 h-4 text-amber-500 absolute left-3.5 top-3" />
                        <select
                          value={selectedCurrency}
                          onChange={(e) => setSelectedCurrency(e.target.value)}
                          className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition cursor-pointer"
                        >
                          {SUPPORTED_CURRENCIES.map((c) => (
                            <option key={c.code} value={c.code} className="bg-white dark:bg-slate-800">
                              {c.code} ({c.symbol}) — {c.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </>
                )}

                {/* Email Address */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="email"
                      required
                      value={userEmail}
                      onChange={(e) => setUserEmail(e.target.value)}
                      placeholder="user@example.com"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition font-mono"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={userPassword}
                      onChange={(e) => setUserPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full pl-10 pr-10 py-2.5 bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Submit User Auth */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl shadow-md shadow-indigo-600/25 transition flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
                >
                  {isRegisterMode ? <UserPlus className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                  <span>
                    {isSubmitting
                      ? isRegisterMode
                        ? 'Creating Account...'
                        : 'Signing In...'
                      : isRegisterMode
                      ? 'Create Standard Account'
                      : 'Sign In to Portal'}
                  </span>
                </button>
              </form>

              {/* Mode Switcher */}
              <div className="text-center text-xs text-slate-500 dark:text-slate-400 pt-3 border-t border-slate-100 dark:border-slate-800">
                {isRegisterMode ? (
                  <>
                    Already have an account?{' '}
                    <button
                      type="button"
                      onClick={() => setIsRegisterMode(false)}
                      className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
                    >
                      Sign In
                    </button>
                  </>
                ) : (
                  <>
                    Need an account?{' '}
                    <button
                      type="button"
                      onClick={() => setIsRegisterMode(true)}
                      className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
                    >
                      Register Now
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-slate-400 dark:text-slate-500 border-t border-slate-200/80 dark:border-slate-800">
        SmartSpend Expense Tracker • Protected by Spring Boot Security
      </footer>
    </div>
  );
};
