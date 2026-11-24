// =============================================================================
// Supported Currencies Configuration
// =============================================================================
export const SUPPORTED_CURRENCIES = [
  { code: 'USD', symbol: '$', name: 'US Dollar', locale: 'en-US' },
  { code: 'EUR', symbol: '€', name: 'Euro', locale: 'de-DE' },
  { code: 'GBP', symbol: '£', name: 'British Pound', locale: 'en-GB' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee', locale: 'en-IN' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen', locale: 'ja-JP' },
  { code: 'CAD', symbol: 'CA$', name: 'Canadian Dollar', locale: 'en-CA' },
  { code: 'AUD', symbol: 'AU$', name: 'Australian Dollar', locale: 'en-AU' },
  { code: 'CHF', symbol: 'CHF', name: 'Swiss Franc', locale: 'de-CH' },
  { code: 'CNY', symbol: 'CN¥', name: 'Chinese Yuan', locale: 'zh-CN' },
  { code: 'SGD', symbol: 'SG$', name: 'Singapore Dollar', locale: 'en-SG' },
  { code: 'AED', symbol: 'AED', name: 'UAE Dirham', locale: 'ar-AE' },
];

export const getCurrencySymbol = (currencyCode = 'USD') => {
  if (!currencyCode) return '$';
  const match = SUPPORTED_CURRENCIES.find((c) => c.code === currencyCode.toUpperCase());
  return match ? match.symbol : currencyCode;
};

// Global active application currency
let currentAppCurrency = 'USD';

export const setAppCurrency = (currency) => {
  if (currency && typeof currency === 'string') {
    currentAppCurrency = currency.trim().toUpperCase();
  }
};

export const getAppCurrency = () => {
  return currentAppCurrency;
};

// Format currency dynamically with locale & symbol support
export const formatCurrency = (amount, currency = null) => {
  const activeCurrency = (currency || currentAppCurrency || 'USD').toUpperCase();
  const numericAmount = typeof amount === 'number' ? amount : parseFloat(amount) || 0;

  const currencyInfo = SUPPORTED_CURRENCIES.find((c) => c.code === activeCurrency);
  const locale = currencyInfo?.locale || 'en-US';

  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: activeCurrency,
      minimumFractionDigits: activeCurrency === 'JPY' ? 0 : 2,
      maximumFractionDigits: activeCurrency === 'JPY' ? 0 : 2,
    }).format(numericAmount);
  } catch {
    const symbol = getCurrencySymbol(activeCurrency);
    return `${symbol}${numericAmount.toFixed(2)}`;
  }
};

// Format date to readable string
export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
};

// Format month and year (e.g. "November 2026")
export const formatMonthYear = (yearMonthStr) => {
  if (!yearMonthStr) return '';
  const [year, month] = yearMonthStr.split('-');
  const date = new Date(parseInt(year, 10), parseInt(month, 10) - 1, 1);
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    year: 'numeric',
  }).format(date);
};

// Get current Year-Month string (YYYY-MM)
export const getCurrentYearMonth = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
};

// Calculate percentage and cap between 0 and 100 or return actual
export const calculatePercentage = (value, total) => {
  if (!total || total <= 0) return 0;
  return Math.round((value / total) * 100);
};

// Category colors and icon helpers
export const EXPENSE_CATEGORIES = [
  { id: 'Food & Dining', name: 'Food & Dining', color: '#f97316', bg: 'bg-orange-50 text-orange-600 border-orange-200' },
  { id: 'Travel & Transport', name: 'Travel & Transport', color: '#0ea5e9', bg: 'bg-sky-50 text-sky-600 border-sky-200' },
  { id: 'Shopping', name: 'Shopping', color: '#ec4899', bg: 'bg-pink-50 text-pink-600 border-pink-200' },
  { id: 'Education', name: 'Education', color: '#8b5cf6', bg: 'bg-purple-50 text-purple-600 border-purple-200' },
  { id: 'Housing & Rent', name: 'Housing & Rent', color: '#10b981', bg: 'bg-emerald-50 text-emerald-600 border-emerald-200' },
  { id: 'Utilities & Bills', name: 'Utilities & Bills', color: '#eab308', bg: 'bg-amber-50 text-amber-600 border-amber-200' },
  { id: 'Entertainment', name: 'Entertainment', color: '#6366f1', bg: 'bg-indigo-50 text-indigo-600 border-indigo-200' },
  { id: 'Healthcare', name: 'Healthcare', color: '#ef4444', bg: 'bg-rose-50 text-rose-600 border-rose-200' },
  { id: 'Other', name: 'Other', color: '#64748b', bg: 'bg-slate-50 text-slate-600 border-slate-200' },
];

export const INCOME_SOURCES = [
  { id: 'Salary', name: 'Salary', color: '#10b981' },
  { id: 'Freelance & Contract', name: 'Freelance & Contract', color: '#06b6d4' },
  { id: 'Investments & Dividends', name: 'Investments & Dividends', color: '#8b5cf6' },
  { id: 'Business Profit', name: 'Business Profit', color: '#f59e0b' },
  { id: 'Gift & Bonus', name: 'Gift & Bonus', color: '#ec4899' },
  { id: 'Other', name: 'Other Income', color: '#64748b' },
];

export const PAYMENT_METHODS = [
  'Credit Card',
  'Debit Card',
  'UPI / Instant Pay',
  'Net Banking',
  'Cash',
  'Digital Wallet',
];
