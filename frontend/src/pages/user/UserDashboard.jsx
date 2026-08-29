import React, { useState, useEffect } from 'react';
import { Navbar } from '../../components/Navbar';
import { storeService } from '../../services/storeService';
import { StarRating } from '../../components/StarRating';
import { RateStoreModal } from './RateStoreModal';
import { useAuth } from '../../context/AuthContext';
import {
  Store,
  Search,
  Filter,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Star,
  Edit3,
  CheckCircle2,
  RefreshCw,
  MapPin,
  Sparkles,
} from 'lucide-react';

export const UserDashboard = () => {
  const { user } = useAuth();
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filters & Search
  const [search, setSearch] = useState('');
  const [nameFilter, setNameFilter] = useState('');
  const [addressFilter, setAddressFilter] = useState('');

  // Sorting
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('ASC');

  // Rating Modal
  const [selectedStore, setSelectedStore] = useState(null);
  const [isRateModalOpen, setIsRateModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const fetchStores = async () => {
    try {
      setLoading(true);
      setError('');
      const params = {
        search: search || undefined,
        name: nameFilter || undefined,
        address: addressFilter || undefined,
        sortBy,
        sortOrder,
      };

      const data = await storeService.getAllStores(params);
      if (data.success) {
        setStores(data.stores || []);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load stores.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStores();
  }, [nameFilter, addressFilter, sortBy, sortOrder]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchStores();
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'ASC' ? 'DESC' : 'ASC');
    } else {
      setSortBy(field);
      setSortOrder('ASC');
    }
  };

  const handleOpenRateModal = (store) => {
    setSelectedStore(store);
    setIsRateModalOpen(true);
  };

  const handleRatingSaved = () => {
    setToastMessage('Your rating was recorded successfully!');
    setTimeout(() => setToastMessage(''), 4000);
    fetchStores();
  };

  const renderSortIcon = (field) => {
    if (sortBy !== field) {
      return <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 opacity-0 group-hover:opacity-100 transition" />;
    }
    return sortOrder === 'ASC' ? (
      <ArrowUp className="w-3.5 h-3.5 text-indigo-600" />
    ) : (
      <ArrowDown className="w-3.5 h-3.5 text-indigo-600" />
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Toast Alert */}
        {toastMessage && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold shadow-sm flex items-center justify-between animate-fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{toastMessage}</span>
            </div>
            <button
              onClick={() => setToastMessage('')}
              className="text-emerald-600 hover:text-emerald-900 ml-2"
            >
              ✕
            </button>
          </div>
        )}

        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-indigo-600/15 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
          <div className="space-y-2 relative z-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-xs font-semibold backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Store Explorer & Rating Hub</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Welcome back, {user?.name.split(' ')[0]}!
            </h1>
            <p className="text-xs sm:text-sm text-indigo-100 max-w-xl">
              Browse all registered stores, search by name or location, and share your authentic rating feedback (1 - 5 stars).
            </p>
          </div>

          <div className="flex items-center gap-3 relative z-10">
            <div className="bg-white/10 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/20 text-center min-w-[120px]">
              <span className="block text-2xl font-black text-white">{stores.length}</span>
              <span className="text-[11px] font-medium text-indigo-200">Registered Stores</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/20 text-center min-w-[120px]">
              <span className="block text-2xl font-black text-amber-300">
                {stores.filter((s) => s.myRating !== null).length}
              </span>
              <span className="text-[11px] font-medium text-indigo-200">Rated by You</span>
            </div>
          </div>
        </div>

        {/* Search & Filter Controls */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 uppercase tracking-wider">
              <Search className="w-3.5 h-3.5 text-indigo-600" />
              <span>Search Stores by Name and Address</span>
            </div>

            {(search || nameFilter || addressFilter) && (
              <button
                onClick={() => {
                  setSearch('');
                  setNameFilter('');
                  setAddressFilter('');
                }}
                className="text-xs font-semibold text-rose-600 hover:text-rose-700"
              >
                Clear Search
              </button>
            )}
          </div>

          <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* General Search */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 mb-1 uppercase">
                Quick Search (Name or Address)
              </label>
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="e.g. Organic Supermarket or City..."
                  className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Name Filter */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 mb-1 uppercase">
                Search by Store Name
              </label>
              <input
                type="text"
                value={nameFilter}
                onChange={(e) => setNameFilter(e.target.value)}
                placeholder="Store Name keyword..."
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Address Filter */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 mb-1 uppercase">
                Search by Store Address
              </label>
              <div className="relative">
                <MapPin className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  value={addressFilter}
                  onChange={(e) => setAddressFilter(e.target.value)}
                  placeholder="Street, City, Sector..."
                  className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </form>
        </div>

        {/* Stores Table */}
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
                      <span>Store Name</span>
                      {renderSortIcon('name')}
                    </div>
                  </th>

                  <th
                    onClick={() => handleSort('address')}
                    className="py-3.5 px-4 cursor-pointer hover:bg-slate-100/80 transition group"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Address</span>
                      {renderSortIcon('address')}
                    </div>
                  </th>

                  <th
                    onClick={() => handleSort('overallRating')}
                    className="py-3.5 px-4 cursor-pointer hover:bg-slate-100/80 transition group"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Overall Rating</span>
                      {renderSortIcon('overallRating')}
                    </div>
                  </th>

                  <th
                    onClick={() => handleSort('myRating')}
                    className="py-3.5 px-4 cursor-pointer hover:bg-slate-100/80 transition group"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Your Submitted Rating</span>
                      {renderSortIcon('myRating')}
                    </div>
                  </th>

                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="py-12 text-center text-slate-400">
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-7 h-7 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-xs font-medium">Loading store listings...</span>
                      </div>
                    </td>
                  </tr>
                ) : stores.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="py-12 text-center text-slate-500">
                      <div className="max-w-xs mx-auto text-center space-y-2">
                        <Store className="w-8 h-8 mx-auto text-slate-300" />
                        <p className="font-semibold text-slate-700 text-sm">No stores found</p>
                        <p className="text-xs text-slate-400">
                          Try searching for a different store name or location.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  stores.map((s) => {
                    const hasRated = s.myRating !== null && s.myRating > 0;

                    return (
                      <tr key={s.id} className="hover:bg-slate-50/70 transition">
                        {/* Store Name */}
                        <td className="py-4 px-4 font-semibold text-slate-900 max-w-[240px]">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold flex-shrink-0">
                              <Store className="w-4 h-4" />
                            </div>
                            <span className="line-clamp-2 leading-snug">{s.name}</span>
                          </div>
                        </td>

                        {/* Address */}
                        <td className="py-4 px-4 text-slate-600 max-w-[300px]">
                          <div className="flex items-start gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 mt-0.5" />
                            <span className="line-clamp-2 leading-relaxed">{s.address}</span>
                          </div>
                        </td>

                        {/* Overall Rating */}
                        <td className="py-4 px-4">
                          <StarRating
                            rating={s.overallRating}
                            count={s.totalRatings}
                            size="sm"
                          />
                        </td>

                        {/* User's Submitted Rating */}
                        <td className="py-4 px-4">
                          {hasRated ? (
                            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-xl bg-amber-50 border border-amber-200">
                              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                              <span className="font-bold text-amber-900 text-xs">
                                {s.myRating} / 5 Stars
                              </span>
                            </div>
                          ) : (
                            <span className="text-slate-400 italic text-[11px] px-2 py-1 bg-slate-100 rounded-lg">
                              Not rated yet
                            </span>
                          )}
                        </td>

                        {/* Action Buttons */}
                        <td className="py-4 px-4 text-right">
                          {hasRated ? (
                            <button
                              onClick={() => handleOpenRateModal(s)}
                              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold transition border border-indigo-200/60"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              Modify Rating
                            </button>
                          ) : (
                            <button
                              onClick={() => handleOpenRateModal(s)}
                              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-xs font-bold shadow-md shadow-indigo-600/20 transition"
                            >
                              <Star className="w-3.5 h-3.5" />
                              Rate Store
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Table Footer */}
          <div className="p-4 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 flex justify-between items-center">
            <span>
              Showing <strong className="text-slate-800">{stores.length}</strong> stores
            </span>
            <span>Sorted by: <strong className="text-slate-800">{sortBy}</strong> ({sortOrder})</span>
          </div>
        </div>
      </main>

      {/* Rate Store Modal */}
      <RateStoreModal
        isOpen={isRateModalOpen}
        onClose={() => {
          setIsRateModalOpen(false);
          setSelectedStore(null);
        }}
        store={selectedStore}
        onRatingSaved={handleRatingSaved}
      />
    </div>
  );
};
