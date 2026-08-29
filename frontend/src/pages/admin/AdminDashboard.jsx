import React, { useState, useEffect } from 'react';
import { Navbar } from '../../components/Navbar';
import { AdminUsers } from './AdminUsers';
import { AdminStores } from './AdminStores';
import { adminService } from '../../services/adminService';
import {
  Users,
  Building2,
  Star,
  ShieldCheck,
  PlusCircle,
  UserPlus,
  TrendingUp,
  LayoutDashboard,
  Store,
} from 'lucide-react';

export const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'users' | 'stores'
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalStores: 0,
    totalRatings: 0,
    breakdown: {
      admins: 0,
      normalUsers: 0,
      storeOwners: 0,
    },
  });
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const data = await adminService.getDashboardStats();
      if (data.success && data.stats) {
        setStats(data.stats);
      }
    } catch (err) {
      console.error('Failed to load admin stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              System Administrator Portal
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Global overview and management of users, stores, and ratings
            </p>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-1.5 p-1.5 bg-slate-200/70 rounded-2xl">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
                activeTab === 'overview'
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              Overview
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
                activeTab === 'users'
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Users className="w-4 h-4" />
              Users Directory
            </button>
            <button
              onClick={() => setActiveTab('stores')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
                activeTab === 'stores'
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Building2 className="w-4 h-4" />
              Stores Directory
            </button>
          </div>
        </div>

        {/* 3 Metric Cards (Required by challenge) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {/* Card 1: Total Users */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition relative overflow-hidden group">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Total Users
              </span>
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900">
                {loading ? '...' : stats.totalUsers}
              </span>
              <span className="text-xs text-slate-400 font-medium">registered</span>
            </div>
            <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-medium">
              <span>{stats.breakdown?.normalUsers || 0} Normal</span>
              <span>•</span>
              <span>{stats.breakdown?.storeOwners || 0} Owners</span>
              <span>•</span>
              <span>{stats.breakdown?.admins || 0} Admins</span>
            </div>
          </div>

          {/* Card 2: Total Stores */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition relative overflow-hidden group">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Total Stores
              </span>
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition">
                <Building2 className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900">
                {loading ? '...' : stats.totalStores}
              </span>
              <span className="text-xs text-slate-400 font-medium">active stores</span>
            </div>
            <div className="mt-3 pt-3 border-t border-slate-100 text-[11px] text-slate-500 font-medium">
              Verified business profiles listed on platform
            </div>
          </div>

          {/* Card 3: Total Submitted Ratings */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition relative overflow-hidden group">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Total Ratings Submitted
              </span>
              <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 transition">
                <Star className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900">
                {loading ? '...' : stats.totalRatings}
              </span>
              <span className="text-xs text-slate-400 font-medium">feedback records</span>
            </div>
            <div className="mt-3 pt-3 border-t border-slate-100 text-[11px] text-slate-500 font-medium">
              Customer review ratings between 1 and 5 stars
            </div>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Quick Access Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div
                onClick={() => setActiveTab('users')}
                className="p-6 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-3xl text-white shadow-lg shadow-indigo-500/20 cursor-pointer hover:scale-[1.01] transition relative overflow-hidden"
              >
                <div className="relative z-10">
                  <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-3">
                    <Users className="w-5 h-5" />
                  </div>
                  <h3 className="text-xl font-bold">Manage Users Directory</h3>
                  <p className="text-xs text-indigo-100 mt-1 max-w-sm">
                    Search, filter, view details, inspect store ratings, and create new administrators, normal users, or store owners.
                  </p>
                  <div className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold bg-white text-indigo-700 px-3.5 py-1.5 rounded-xl">
                    View Users Table →
                  </div>
                </div>
              </div>

              <div
                onClick={() => setActiveTab('stores')}
                className="p-6 bg-gradient-to-br from-slate-800 to-slate-950 rounded-3xl text-white shadow-lg shadow-slate-900/20 cursor-pointer hover:scale-[1.01] transition relative overflow-hidden"
              >
                <div className="relative z-10">
                  <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-3">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <h3 className="text-xl font-bold">Manage Stores Directory</h3>
                  <p className="text-xs text-slate-300 mt-1 max-w-sm">
                    Search and filter stores, view aggregated star ratings, assign owners, and register new retail locations.
                  </p>
                  <div className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold bg-white text-slate-900 px-3.5 py-1.5 rounded-xl">
                    View Stores Table →
                  </div>
                </div>
              </div>
            </div>

            {/* Embed Users List on overview */}
            <AdminUsers />
          </div>
        )}

        {activeTab === 'users' && <AdminUsers />}

        {activeTab === 'stores' && <AdminStores />}
      </main>
    </div>
  );
};
