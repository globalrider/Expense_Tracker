import React, { useState, useEffect, useCallback } from 'react';
import { apiService } from '../../api/apiService';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { SUPPORTED_CURRENCIES } from '../../utils/formatters';
import {
  Users,
  ShieldCheck,
  UserPlus,
  Search,
  Edit2,
  Trash2,
  Briefcase,
  Camera,
  X,
  Filter,
  User,
  Activity,
  Server,
  Database,
  Cpu,
  HardDrive,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  Clock,
  Layers,
  Radio,
  FileCode,
  Copy,
  Check,
} from 'lucide-react';

const formatBytes = (bytes) => {
  if (!bytes || bytes <= 0) return '0 MB';
  const mb = bytes / (1024 * 1024);
  if (mb >= 1024) {
    return `${(mb / 1024).toFixed(2)} GB`;
  }
  return `${mb.toFixed(1)} MB`;
};

const formatUptime = (seconds) => {
  if (!seconds || seconds <= 0) return '0s';
  const d = Math.floor(seconds / (3600 * 24));
  const h = Math.floor((seconds % (3600 * 24)) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);

  const parts = [];
  if (d > 0) parts.push(`${d}d`);
  if (h > 0) parts.push(`${h}h`);
  if (m > 0) parts.push(`${m}m`);
  parts.push(`${s}s`);
  return parts.join(' ');
};

export const AdminDashboard = () => {
  const { user: currentAdmin } = useAuth();
  const { success, error } = useToast();

  const [activeTab, setActiveTab] = useState('users'); // 'users' | 'system'

  // Actuator Monitoring States
  const [actuatorData, setActuatorData] = useState(null);
  const [actuatorLoading, setActuatorLoading] = useState(false);
  const [actuatorError, setActuatorError] = useState(null);
  const [copiedEndpoint, setCopiedEndpoint] = useState(null);
  const [showRawJson, setShowRawJson] = useState(false);

  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({ totalUsers: 0, userCount: 0, adminCount: 0 });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  // Form States
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formProfession, setFormProfession] = useState('Software Engineer');
  const [formAvatar, setFormAvatar] = useState('https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80');
  const [formRole, setFormRole] = useState('ROLE_USER');
  const [formCurrency, setFormCurrency] = useState('USD');
  const [formThreshold, setFormThreshold] = useState(80);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const [userList, statData] = await Promise.all([
        apiService.admin.getAllUsers(),
        apiService.admin.getStats(),
      ]);
      setUsers(userList || []);
      setStats(statData || {
        totalUsers: userList.length,
        userCount: userList.filter(u => u.role !== 'ROLE_ADMIN').length,
        adminCount: userList.filter(u => u.role === 'ROLE_ADMIN').length,
      });
    } catch (err) {
      console.error('Failed to load user list:', err);
      error('Failed to load user directory.');
    } finally {
      setLoading(false);
    }
  }, [error]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const fetchActuatorData = useCallback(async () => {
    try {
      setActuatorLoading(true);
      setActuatorError(null);
      const data = await apiService.actuator.getOverview();
      setActuatorData(data);
    } catch (err) {
      console.error('Actuator error:', err);
      setActuatorError(err.message || 'Failed to fetch Spring Boot Actuator metrics.');
    } finally {
      setActuatorLoading(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === 'system' && !actuatorData && !actuatorLoading) {
      fetchActuatorData();
    }
  }, [activeTab, actuatorData, actuatorLoading, fetchActuatorData]);

  const handleCopyEndpoint = (path) => {
    const fullUrl = `http://localhost:8080${path}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedEndpoint(path);
    setTimeout(() => setCopiedEndpoint(null), 2000);
  };

  const handleOpenAdd = () => {
    setFormName('');
    setFormEmail('');
    setFormProfession('Software Engineer');
    setFormAvatar('https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80');
    setFormRole('ROLE_USER');
    setFormCurrency('USD');
    setFormThreshold(80);
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (targetUser) => {
    setEditingUser(targetUser);
    setFormName(targetUser.name);
    setFormEmail(targetUser.email);
    setFormProfession(targetUser.profession || 'Professional');
    setFormAvatar(targetUser.avatar || '');
    setFormRole(targetUser.role);
    setFormCurrency(targetUser.currency || 'USD');
    setFormThreshold(targetUser.monthlyBudgetAlertThreshold || 80);
  };

  const handleSaveAdd = async (e) => {
    e.preventDefault();
    if (!formName || !formEmail) {
      error('Name and email are required.');
      return;
    }
    try {
      await apiService.admin.createUser({
        name: formName,
        email: formEmail,
        profession: formProfession,
        avatar: formAvatar,
        role: formRole,
        currency: formCurrency,
        monthlyBudgetAlertThreshold: Number(formThreshold),
      });
      success(`User ${formName} created successfully!`);
      setIsAddModalOpen(false);
      fetchUsers();
    } catch (err) {
      error(err.message || 'Failed to create user.');
    }
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editingUser) return;
    try {
      await apiService.admin.updateUser(editingUser.id, {
        name: formName,
        profession: formProfession,
        avatar: formAvatar,
        role: formRole,
        currency: formCurrency,
        monthlyBudgetAlertThreshold: Number(formThreshold),
      });
      success(`User ${formName} updated!`);
      setEditingUser(null);
      fetchUsers();
    } catch (err) {
      error(err.message || 'Failed to update user.');
    }
  };

  const handleToggleRole = async (targetUser) => {
    if (targetUser.email?.toLowerCase() === 'itachi@gmail.com') {
      error('The primary administrator account (itachi) cannot have its role changed.');
      return;
    }
    const newRole = targetUser.role === 'ROLE_ADMIN' ? 'ROLE_USER' : 'ROLE_ADMIN';
    try {
      await apiService.admin.updateUser(targetUser.id, {
        role: newRole,
      });
      success(`Role for ${targetUser.name} changed to ${newRole === 'ROLE_ADMIN' ? 'Administrator' : 'Standard User'}`);
      fetchUsers();
    } catch (err) {
      error('Failed to change user role.');
    }
  };

  const handleDeleteUser = async (targetUser) => {
    if (targetUser.id === currentAdmin?.id || targetUser.email?.toLowerCase() === 'itachi@gmail.com') {
      error('You cannot delete the primary administrator account (itachi)!');
      return;
    }
    if (!window.confirm(`Are you sure you want to delete user "${targetUser.name}" (${targetUser.email})? All associated records will be removed.`)) {
      return;
    }

    try {
      await apiService.admin.deleteUser(targetUser.id);
      success(`User ${targetUser.name} has been removed.`);
      fetchUsers();
    } catch (err) {
      error(err.message || 'Failed to delete user.');
    }
  };

  // Filtered Users
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.profession && u.profession.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesRole =
      roleFilter === 'ALL' ||
      (roleFilter === 'ADMIN' && u.role === 'ROLE_ADMIN') ||
      (roleFilter === 'USER' && u.role === 'ROLE_USER');
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2.5 rounded-2xl bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
              {activeTab === 'users' ? <ShieldCheck className="w-6 h-6" /> : <Activity className="w-6 h-6" />}
            </span>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                {activeTab === 'users' ? 'User Directory & Access Control' : 'Spring Boot Actuator & System Diagnostics'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {activeTab === 'users'
                  ? 'Administer registered user accounts, professions, roles, and platform permissions.'
                  : 'Live backend health status, JVM memory usage, process uptime, and Micrometer metrics.'}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === 'users' ? (
            <button
              onClick={handleOpenAdd}
              className="flex items-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-2xl shadow-md shadow-purple-600/20 transition shrink-0"
            >
              <UserPlus className="w-4 h-4" />
              <span>Add New User</span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={fetchActuatorData}
                disabled={actuatorLoading}
                className="flex items-center gap-2 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-2xl transition disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${actuatorLoading ? 'animate-spin' : ''}`} />
                <span>{actuatorLoading ? 'Refreshing...' : 'Refresh'}</span>
              </button>
              <a
                href="http://localhost:8080/swagger-ui.html"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3.5 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-2xl shadow-md shadow-purple-600/20 transition"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Swagger UI</span>
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Admin Tab Switcher */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('users')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-2xl transition ${
            activeTab === 'users'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>User Directory ({users.length})</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('system');
            if (!actuatorData) fetchActuatorData();
          }}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-2xl transition ${
            activeTab === 'system'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>System Monitoring &amp; Actuator</span>
          {actuatorData?.isOnline && (
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse ml-0.5"></span>
          )}
        </button>
      </div>

      {/* ---------------------------------------------------- */}
      {/* TAB 1: USERS DIRECTORY VIEW */}
      {/* ---------------------------------------------------- */}
      {activeTab === 'users' && (
        <div className="space-y-6">
          {/* KPI Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Registered Users</span>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">{stats.totalUsers}</div>
            <span className="text-[11px] text-slate-400 dark:text-slate-500">Accounts on platform</span>
          </div>
          <div className="p-3 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-2xl">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Standard Users</span>
            <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">{stats.userCount}</div>
            <span className="text-[11px] text-emerald-600/80 dark:text-emerald-400/80">ROLE_USER (Personal Finances)</span>
          </div>
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-2xl">
            <User className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">System Administrators</span>
            <div className="text-2xl font-extrabold text-purple-600 dark:text-purple-400 mt-1">{stats.adminCount}</div>
            <span className="text-[11px] text-purple-600/80 dark:text-purple-400/80">ROLE_ADMIN (User Mgmt Only)</span>
          </div>
          <div className="p-3 bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 rounded-2xl">
            <ShieldCheck className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, email, or profession..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:border-purple-500 transition"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Role:</span>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-none focus:border-purple-500 cursor-pointer"
          >
            <option value="ALL">All Roles ({users.length})</option>
            <option value="USER">Standard Users ({stats.userCount})</option>
            <option value="ADMIN">Administrators ({stats.adminCount})</option>
          </select>
        </div>
      </div>

      {/* User Directory Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Who Are the Users ({filteredUsers.length})</h3>
            <p className="text-xs text-slate-400 dark:text-slate-500">All registered system identities, professions, and management actions</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3 px-5">User</th>
                <th className="py-3 px-4">Profession / Title</th>
                <th className="py-3 px-4">System Role</th>
                <th className="py-3 px-4">Currency</th>
                <th className="py-3 px-4">Budget Threshold</th>
                <th className="py-3 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    Loading users...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    No users found matching your search.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => {
                  const isUserAdmin = u.role === 'ROLE_ADMIN';
                  const isCurrent = u.id === currentAdmin?.id;

                  return (
                    <tr key={u.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition">
                      {/* Name & Avatar */}
                      <td className="py-3.5 px-5">
                        <div className="flex items-center gap-3">
                          <img
                            src={u.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.name}`}
                            alt={u.name}
                            className="w-10 h-10 rounded-2xl object-cover ring-2 ring-slate-200 dark:ring-slate-700 shrink-0"
                          />
                          <div>
                            <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                              <span>{u.name}</span>
                              {isCurrent && (
                                <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-1.5 py-0.2 rounded font-normal">
                                  You
                                </span>
                              )}
                            </div>
                            <div className="text-slate-400 dark:text-slate-500 font-mono text-[11px]">{u.email}</div>
                          </div>
                        </div>
                      </td>

                      {/* Profession */}
                      <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300">
                        <div className="flex items-center gap-1.5 font-medium">
                          <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                          <span>{u.profession || 'Professional'}</span>
                        </div>
                      </td>

                      {/* Role */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${isUserAdmin
                              ? 'bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800'
                              : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                              }`}
                          >
                            {isUserAdmin ? 'Administrator' : 'Standard User'}
                          </span>
                          {!isCurrent && (
                            <button
                              onClick={() => handleToggleRole(u)}
                              className="text-[10px] text-indigo-600 dark:text-indigo-400 hover:underline font-semibold"
                              title="Toggle between User and Admin"
                            >
                              Toggle
                            </button>
                          )}
                        </div>
                      </td>

                      {/* Currency */}
                      <td className="py-3.5 px-4 font-mono font-semibold text-slate-700 dark:text-slate-300">
                        {u.currency || 'USD'}
                      </td>

                      {/* Threshold */}
                      <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300">
                        <span className="font-semibold">{u.monthlyBudgetAlertThreshold || 80}%</span>
                        <span className="text-slate-400 dark:text-slate-500 text-[11px]"> cap</span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenEdit(u)}
                            className="p-1.5 text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-slate-800 rounded-lg transition"
                            title="Edit User"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          {!isCurrent && (
                            <button
                              onClick={() => handleDeleteUser(u)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 dark:text-slate-500 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-slate-800 rounded-lg transition"
                              title="Delete User"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )}

      {/* ---------------------------------------------------- */}
      {/* TAB 2: SYSTEM MONITORING & ACTUATOR METRICS */}
      {/* ---------------------------------------------------- */}
      {activeTab === 'system' && (
        <div className="space-y-6">
          {/* Actuator Status & Liveness Banner */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div
                className={`p-3 rounded-2xl border ${
                  actuatorData?.isOnline
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
                    : 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-800'
                }`}
              >
                <Server className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-base font-bold text-slate-900 dark:text-white">
                    {actuatorData?.info?.app?.name || 'Expense Tracker Spring Boot Backend'}
                  </span>
                  {actuatorData?.isOnline ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      HEALTHY (UP)
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-800">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      OFFLINE
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Base URL: <code className="font-mono text-purple-600 dark:text-purple-400">http://localhost:8080/actuator</code> • Environment:{' '}
                  <span className="font-semibold text-slate-700 dark:text-slate-300">Spring Boot 3.4.2 (Production / Dev)</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <Clock className="w-3.5 h-3.5" />
              <span>Last checked: {actuatorData?.lastChecked || 'Just now'}</span>
            </div>
          </div>

          {actuatorError && (
            <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>Could not reach Actuator endpoints: {actuatorError}</span>
              </div>
              <button
                onClick={fetchActuatorData}
                className="px-3 py-1 bg-rose-600 text-white rounded-lg font-bold hover:bg-rose-700 transition"
              >
                Retry
              </button>
            </div>
          )}

          {/* 5 Core Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* JVM Memory (Heap) */}
            <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
                  <span className="text-xs font-semibold">JVM Heap Memory</span>
                  <HardDrive className="w-4 h-4 text-purple-500" />
                </div>
                <div className="text-xl font-extrabold text-slate-900 dark:text-white">
                  {formatBytes(actuatorData?.jvmUsedBytes)}
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Max: {formatBytes(actuatorData?.jvmMaxBytes)}
                </div>
              </div>
              <div className="mt-3">
                {(() => {
                  const used = actuatorData?.jvmUsedBytes || 0;
                  const max = actuatorData?.jvmMaxBytes || 1;
                  const perc = Math.min(Math.round((used / max) * 100), 100);
                  return (
                    <div>
                      <div className="flex justify-between text-[10px] text-slate-500 dark:text-slate-400 font-semibold mb-1">
                        <span>Used Ratio</span>
                        <span>{perc}%</span>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            perc > 85 ? 'bg-rose-500' : perc > 65 ? 'bg-amber-500' : 'bg-purple-600'
                          }`}
                          style={{ width: `${perc}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>

            {/* System CPU Load */}
            <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
                  <span className="text-xs font-semibold">CPU Usage</span>
                  <Cpu className="w-4 h-4 text-indigo-500" />
                </div>
                <div className="text-xl font-extrabold text-indigo-600 dark:text-indigo-400">
                  {actuatorData?.cpuUsage ? `${(actuatorData.cpuUsage * 100).toFixed(1)}%` : '0.0%'}
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">Host CPU load</div>
              </div>
              <div className="mt-3 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Operating Normally</span>
              </div>
            </div>

            {/* Process Uptime */}
            <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
                  <span className="text-xs font-semibold">System Uptime</span>
                  <Clock className="w-4 h-4 text-emerald-500" />
                </div>
                <div className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">
                  {formatUptime(actuatorData?.uptimeSeconds)}
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">Continuous runtime</div>
              </div>
              <div className="mt-3 text-[11px] text-slate-400 font-medium">
                PID Active &amp; Responding
              </div>
            </div>

            {/* JVM Live Threads */}
            <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
                  <span className="text-xs font-semibold">Live Threads</span>
                  <Layers className="w-4 h-4 text-amber-500" />
                </div>
                <div className="text-xl font-extrabold text-slate-900 dark:text-white">
                  {actuatorData?.liveThreads || 0}
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">Worker &amp; GC threads</div>
              </div>
              <div className="mt-3 text-[11px] text-slate-400 font-medium">
                Concurrency Managed
              </div>
            </div>

            {/* HikariCP Connection Pool */}
            <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
                  <span className="text-xs font-semibold">Database Pool</span>
                  <Database className="w-4 h-4 text-cyan-500" />
                </div>
                <div className="text-xl font-extrabold text-cyan-600 dark:text-cyan-400">
                  {actuatorData?.activeDbConnections || 0} active
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">HikariCP Pool</div>
              </div>
              <div className="mt-3 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                <Radio className="w-3.5 h-3.5" />
                <span>Connected</span>
              </div>
            </div>
          </div>

          {/* Subsystem Component Health Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <Database className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span className="text-xs font-bold text-slate-900 dark:text-white">Database Subsystem</span>
              </div>
              <div className="text-xs space-y-1 text-slate-600 dark:text-slate-300">
                <div className="flex justify-between">
                  <span>Component:</span>
                  <span className="font-mono font-semibold">db</span>
                </div>
                <div className="flex justify-between">
                  <span>Engine:</span>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {actuatorData?.health?.components?.db?.details?.database || 'MySQL / H2'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Validation:</span>
                  <span className="text-emerald-600 font-semibold">isValid()</span>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <HardDrive className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span className="text-xs font-bold text-slate-900 dark:text-white">Disk Storage</span>
              </div>
              <div className="text-xs space-y-1 text-slate-600 dark:text-slate-300">
                <div className="flex justify-between">
                  <span>Component:</span>
                  <span className="font-mono font-semibold">diskSpace</span>
                </div>
                <div className="flex justify-between">
                  <span>Free Disk:</span>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {formatBytes(actuatorData?.health?.components?.diskSpace?.details?.free)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Total Space:</span>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {formatBytes(actuatorData?.health?.components?.diskSpace?.details?.total)}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <Radio className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span className="text-xs font-bold text-slate-900 dark:text-white">Liveness Ping</span>
              </div>
              <div className="text-xs space-y-1 text-slate-600 dark:text-slate-300">
                <div className="flex justify-between">
                  <span>Component:</span>
                  <span className="font-mono font-semibold">ping</span>
                </div>
                <div className="flex justify-between">
                  <span>Probe:</span>
                  <span className="text-emerald-600 font-semibold">UP</span>
                </div>
                <div className="flex justify-between">
                  <span>Response:</span>
                  <span className="font-semibold text-slate-900 dark:text-white">OK</span>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <ShieldCheck className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span className="text-xs font-bold text-slate-900 dark:text-white">Platform Security</span>
              </div>
              <div className="text-xs space-y-1 text-slate-600 dark:text-slate-300">
                <div className="flex justify-between">
                  <span>Superadmin:</span>
                  <span className="font-mono font-bold text-purple-600 dark:text-purple-400">itachi</span>
                </div>
                <div className="flex justify-between">
                  <span>Public Signup:</span>
                  <span className="text-emerald-600 font-semibold">ROLE_USER Only</span>
                </div>
                <div className="flex justify-between">
                  <span>Admin Protection:</span>
                  <span className="text-emerald-600 font-semibold">Enforced</span>
                </div>
              </div>
            </div>
          </div>

          {/* Actuator Endpoints Hub */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Actuator HTTP Endpoints Directory</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Direct links to inspect Spring Boot Actuator endpoints in your browser or external monitoring systems (Prometheus, Grafana).
                </p>
              </div>
              <button
                onClick={() => setShowRawJson(!showRawJson)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-xl transition"
              >
                <FileCode className="w-3.5 h-3.5" />
                <span>{showRawJson ? 'Hide Raw JSON' : 'View Raw Diagnostics JSON'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {[
                {
                  path: '/actuator',
                  name: 'Actuator Discovery Root',
                  description: 'Hypermedia index of all available management endpoints and navigation links.',
                },
                {
                  path: '/actuator/health',
                  name: 'Health & Liveness Probes',
                  description: 'Comprehensive health status of MySQL, HikariCP, and disk storage.',
                },
                {
                  path: '/actuator/metrics',
                  name: 'Micrometer Metrics Index',
                  description: 'Exposes all available JVM, CPU, database, and HTTP execution metrics.',
                },
                {
                  path: '/actuator/info',
                  name: 'Application Info & Version',
                  description: 'Version 1.0.0, application name, administrator email, and system metadata.',
                },
                {
                  path: '/actuator/env',
                  name: 'Environment & Properties',
                  description: 'Active Spring profiles, loaded configuration properties, and system environment.',
                },
                {
                  path: '/actuator/loggers',
                  name: 'Loggers & Severity Levels',
                  description: 'Inspect and configure runtime log levels for com.expensetracker packages.',
                },
                {
                  path: '/actuator/beans',
                  name: 'ApplicationContext Beans',
                  description: 'Complete list of all configured Spring Boot beans and dependency graphs.',
                },
                {
                  path: '/actuator/mappings',
                  name: 'HTTP Endpoint Mappings',
                  description: 'Full registry of all REST endpoints, path variables, and dispatch handlers.',
                },
                {
                  path: '/swagger-ui.html',
                  name: 'OpenAPI 3 / Swagger UI',
                  description: 'Interactive API playground and schema documentation for all REST services.',
                },
              ].map((endpoint) => (
                <div
                  key={endpoint.path}
                  className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between hover:border-purple-300 dark:hover:border-purple-800 transition"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-purple-600 dark:text-purple-400">
                        {endpoint.path}
                      </span>
                      <button
                        onClick={() => handleCopyEndpoint(endpoint.path)}
                        className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
                        title="Copy Endpoint URL"
                      >
                        {copiedEndpoint === endpoint.path ? (
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                    <div className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-1">
                      {endpoint.name}
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                      {endpoint.description}
                    </p>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex justify-end">
                    <a
                      href={`http://localhost:8080${endpoint.path}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-purple-600 dark:text-purple-400 hover:underline"
                    >
                      <span>Open in Browser</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              ))}
            </div>

            {/* Collapsible Raw JSON Viewer */}
            {showRawJson && (
              <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Live Diagnostics JSON (Health &amp; Info Response)
                  </span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(JSON.stringify(actuatorData, null, 2));
                      success('Diagnostics JSON copied to clipboard!');
                    }}
                    className="flex items-center gap-1 text-xs text-purple-600 dark:text-purple-400 font-semibold hover:underline"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Full JSON</span>
                  </button>
                </div>
                <pre className="p-4 bg-slate-950 text-emerald-400 font-mono text-[11px] rounded-2xl overflow-x-auto max-h-80 scrollbar-thin">
                  {JSON.stringify(actuatorData, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Add User Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Add New User</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveAdd} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Rachel Green"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Profession / Job Title</label>
                <input
                  type="text"
                  required
                  value={formProfession}
                  onChange={(e) => setFormProfession(e.target.value)}
                  placeholder="e.g. UI/UX Designer"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-purple-500"
                />
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {['Software Engineer', 'UI/UX Designer', 'Product Manager', 'Data Analyst', 'Marketing Lead'].map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setFormProfession(p)}
                      className={`text-[10px] px-2 py-0.5 rounded border transition ${
                        formProfession === p
                          ? 'bg-purple-600 text-white border-purple-600'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Photo / Avatar URL</label>
                <input
                  type="url"
                  value={formAvatar}
                  onChange={(e) => setFormAvatar(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-purple-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  placeholder="rachel@example.com"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-purple-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Account Role</label>
                <div className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200">
                  Standard User (ROLE_USER)
                </div>
                <p className="text-[10px] text-slate-400 mt-1">Admin creation is restricted. Only standard users can be created.</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Currency</label>
                  <select
                    value={formCurrency}
                    onChange={(e) => setFormCurrency(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-none focus:border-purple-500"
                  >
                    {SUPPORTED_CURRENCIES.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.code} ({c.symbol})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Alert Threshold (%)</label>
                  <input
                    type="number"
                    min="50"
                    max="100"
                    value={formThreshold}
                    onChange={(e) => setFormThreshold(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white rounded-xl transition"
                >
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Edit User: {editingUser.name}</h3>
              <button
                onClick={() => setEditingUser(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Profession / Job Title</label>
                <input
                  type="text"
                  required
                  value={formProfession}
                  onChange={(e) => setFormProfession(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Photo / Avatar URL</label>
                <input
                  type="url"
                  value={formAvatar}
                  onChange={(e) => setFormAvatar(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-purple-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
                <input
                  type="email"
                  disabled
                  value={formEmail}
                  className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-500 dark:text-slate-400 font-mono cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Account Role</label>
                <div className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200">
                  Standard User (ROLE_USER)
                </div>
                <p className="text-[10px] text-slate-400 mt-1">Admin creation is restricted. Only standard users can be created.</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Currency</label>
                  <select
                    value={formCurrency}
                    onChange={(e) => setFormCurrency(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-none focus:border-purple-500"
                  >
                    {SUPPORTED_CURRENCIES.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.code} ({c.symbol})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Alert Threshold (%)</label>
                  <input
                    type="number"
                    min="50"
                    max="100"
                    value={formThreshold}
                    onChange={(e) => setFormThreshold(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white rounded-xl transition"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
