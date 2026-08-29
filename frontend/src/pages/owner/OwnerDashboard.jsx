import React, { useState, useEffect } from 'react';
import { Navbar } from '../../components/Navbar';
import { ratingService } from '../../services/ratingService';
import { StarRating } from '../../components/StarRating';
import { useAuth } from '../../context/AuthContext';
import {
  Store,
  Star,
  Users,
  MapPin,
  Mail,
  Calendar,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  RefreshCw,
  Award,
  TrendingUp,
} from 'lucide-react';

export const OwnerDashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Sorting
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('DESC');

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await ratingService.getOwnerDashboard({ sortBy, sortOrder });
      if (res.success) {
        setData(res);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load store owner dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [sortBy, sortOrder]);

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'ASC' ? 'DESC' : 'ASC');
    } else {
      setSortBy(field);
      setSortOrder('ASC');
    }
  };

  const renderSortIcon = (field) => {
    if (sortBy !== field) {
      return <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 opacity-0 group-hover:opacity-100 transition" />;
    }
    return sortOrder === 'ASC' ? (
      <ArrowUp className="w-3.5 h-3.5 text-emerald-600" />
    ) : (
      <ArrowDown className="w-3.5 h-3.5 text-emerald-600" />
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Store Owner Portal
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Real-time analytics and customer feedback breakdown for your store
            </p>
          </div>

          <button
            onClick={fetchDashboardData}
            title="Refresh Ratings"
            className="self-start md:self-auto inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 shadow-sm transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh Analytics
          </button>
        </div>

        {/* Store Profile & Summary Card */}
        {data?.hasStore && data?.store ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Store Information Card */}
            <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold shadow-md shadow-emerald-100">
                    <Store className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      Your Registered Store
                    </span>
                    <h2 className="text-xl font-black text-slate-900 mt-1">
                      {data.store.name}
                    </h2>
                  </div>
                </div>

                <div className="space-y-2 text-xs text-slate-600 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span>{data.store.email}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 mt-0.5 flex-shrink-0" />
                    <span>{data.store.address}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>Owner: <strong className="text-slate-800">{user?.name}</strong></span>
                <span>Role: <strong className="text-emerald-700">STORE_OWNER</strong></span>
              </div>
            </div>

            {/* Average Rating Metric Card */}
            <div className="bg-gradient-to-br from-emerald-600 to-teal-800 rounded-3xl p-6 sm:p-7 text-white shadow-xl shadow-emerald-700/15 flex flex-col justify-between relative overflow-hidden">
              <div className="relative z-10">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-200 uppercase tracking-wider">
                    Average Store Rating
                  </span>
                  <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                    <Award className="w-5 h-5 text-amber-300" />
                  </div>
                </div>

                <div className="mt-4 flex items-baseline gap-3">
                  <span className="text-4xl sm:text-5xl font-black tracking-tight">
                    {data.stats.averageRating > 0 ? data.stats.averageRating.toFixed(1) : '0.0'}
                  </span>
                  <span className="text-sm font-semibold text-emerald-200">/ 5.0 Stars</span>
                </div>

                <div className="mt-3">
                  <StarRating
                    rating={data.stats.averageRating}
                    showValue={false}
                    size="lg"
                  />
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/20 flex items-center justify-between text-xs text-emerald-100 relative z-10">
                <span>Total Customer Ratings:</span>
                <span className="font-black text-white text-base">
                  {data.stats.totalRatings}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-amber-50 border border-amber-200 rounded-3xl p-6 text-amber-800 text-center space-y-2">
            <Store className="w-8 h-8 mx-auto text-amber-600" />
            <h3 className="font-bold text-base">No Store Assigned Yet</h3>
            <p className="text-xs max-w-md mx-auto">
              Your store owner account is registered, but a System Administrator has not linked a store to your profile yet. Please reach out to your administrator.
            </p>
          </div>
        )}

        {/* Ratings Breakdown Table (Users who submitted ratings) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-black text-slate-900">
                Customer Rating Submissions
              </h3>
              <p className="text-xs text-slate-500">
                List of registered users who have reviewed and rated your store
              </p>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <Users className="w-4 h-4 text-slate-400" />
              <span>
                <strong className="text-slate-800">{data?.ratings?.length || 0}</strong> Submissions
              </span>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    <th
                      onClick={() => handleSort('name')}
                      className="py-3.5 px-4 cursor-pointer hover:bg-slate-100/80 transition group"
                    >
                      <div className="flex items-center gap-1.5">
                        <span>Customer Name</span>
                        {renderSortIcon('name')}
                      </div>
                    </th>

                    <th
                      onClick={() => handleSort('email')}
                      className="py-3.5 px-4 cursor-pointer hover:bg-slate-100/80 transition group"
                    >
                      <div className="flex items-center gap-1.5">
                        <span>Customer Email</span>
                        {renderSortIcon('email')}
                      </div>
                    </th>

                    <th className="py-3.5 px-4">Customer Address</th>

                    <th
                      onClick={() => handleSort('rating')}
                      className="py-3.5 px-4 cursor-pointer hover:bg-slate-100/80 transition group"
                    >
                      <div className="flex items-center gap-1.5">
                        <span>Submitted Rating</span>
                        {renderSortIcon('rating')}
                      </div>
                    </th>

                    <th
                      onClick={() => handleSort('createdAt')}
                      className="py-3.5 px-4 cursor-pointer hover:bg-slate-100/80 transition group"
                    >
                      <div className="flex items-center gap-1.5">
                        <span>Date Submitted</span>
                        {renderSortIcon('createdAt')}
                      </div>
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                  {loading ? (
                    <tr>
                      <td colSpan="5" className="py-12 text-center text-slate-400">
                        <div className="flex flex-col items-center gap-2">
                          <div className="w-7 h-7 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
                          <span className="text-xs font-medium">Loading ratings...</span>
                        </div>
                      </td>
                    </tr>
                  ) : !data?.ratings || data.ratings.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="py-12 text-center text-slate-500">
                        <div className="max-w-xs mx-auto text-center space-y-2">
                          <Star className="w-8 h-8 mx-auto text-slate-300" />
                          <p className="font-semibold text-slate-700 text-sm">
                            No ratings submitted yet
                          </p>
                          <p className="text-xs text-slate-400">
                            When normal users submit feedback for your store, they will appear here in real-time.
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    data.ratings.map((r) => (
                      <tr key={r.id} className="hover:bg-slate-50/70 transition">
                        {/* Customer Name */}
                        <td className="py-3.5 px-4 font-semibold text-slate-900 max-w-[200px] truncate">
                          {r.user.name}
                        </td>

                        {/* Customer Email */}
                        <td className="py-3.5 px-4 text-slate-600">{r.user.email}</td>

                        {/* Customer Address */}
                        <td className="py-3.5 px-4 text-slate-600 max-w-[250px] truncate" title={r.user.address}>
                          {r.user.address}
                        </td>

                        {/* Rating */}
                        <td className="py-3.5 px-4">
                          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-xl bg-amber-50 border border-amber-200">
                            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                            <span className="font-bold text-amber-900 text-xs">
                              {r.rating} / 5 Stars
                            </span>
                          </div>
                        </td>

                        {/* Date */}
                        <td className="py-3.5 px-4 text-slate-500 font-medium">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                            <span>{new Date(r.createdAt).toLocaleDateString()}</span>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Table Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 flex justify-between items-center">
              <span>
                Showing <strong className="text-slate-800">{data?.ratings?.length || 0}</strong> reviews
              </span>
              <span>Sorted by: <strong className="text-slate-800">{sortBy}</strong> ({sortOrder})</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
