import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { StarRating } from '../../components/StarRating';
import { AddStoreModal } from './AddStoreModal';
import {
  Building2,
  PlusCircle,
  Search,
  Filter,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  RefreshCw,
  Store as StoreIcon,
  User,
} from 'lucide-react';

export const AdminStores = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filters
  const [search, setSearch] = useState('');
  const [nameFilter, setNameFilter] = useState('');
  const [emailFilter, setEmailFilter] = useState('');
  const [addressFilter, setAddressFilter] = useState('');

  // Sorting
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('ASC');

  // Modals & Toast
  const [isAddStoreOpen, setIsAddStoreOpen] = useState(false);
  const [successToast, setSuccessToast] = useState('');

  const fetchStores = async () => {
    try {
      setLoading(true);
      setError('');
      const params = {
        search: search || undefined,
        name: nameFilter || undefined,
        email: emailFilter || undefined,
        address: addressFilter || undefined,
        sortBy,
        sortOrder,
      };

      const data = await adminService.getStores(params);
      if (data.success) {
        setStores(data.stores || []);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch stores list.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStores();
  }, [nameFilter, emailFilter, addressFilter, sortBy, sortOrder]);

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

  const handleStoreCreated = async (storeData) => {
    await adminService.createStore(storeData);
    setSuccessToast(`Store "${storeData.name}" created successfully!`);
    setTimeout(() => setSuccessToast(''), 4000);
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
    <div className="space-y-6">
      {/* Toast Notification */}
      {successToast && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold shadow-sm flex items-center justify-between animate-fade-in">
          <span>{successToast}</span>
          <button
            onClick={() => setSuccessToast('')}
            className="text-emerald-600 hover:text-emerald-900 font-bold ml-2"
          >
            ✕
          </button>
        </div>
      )}

      {/* Header and Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900">Store Management</h2>
              <p className="text-xs text-slate-500">
                View, filter, sort, manage ratings, and add new registered stores
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchStores}
            title="Refresh List"
            className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={() => setIsAddStoreOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-xs font-bold rounded-xl shadow-md shadow-indigo-600/20 transition"
          >
            <PlusCircle className="w-4 h-4" />
            Add New Store
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 uppercase tracking-wider">
            <Filter className="w-3.5 h-3.5 text-indigo-600" />
            <span>Search & Filter Stores</span>
          </div>

          {(search || nameFilter || emailFilter || addressFilter) && (
            <button
              onClick={() => {
                setSearch('');
                setNameFilter('');
                setEmailFilter('');
                setAddressFilter('');
              }}
              className="text-xs font-semibold text-rose-600 hover:text-rose-700"
            >
              Clear All Filters
            </button>
          )}
        </div>

        <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Keyword Search */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 mb-1 uppercase">
              Keyword Search
            </label>
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Name / Email / Address..."
                className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Name Filter */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 mb-1 uppercase">
              Filter by Name
            </label>
            <input
              type="text"
              value={nameFilter}
              onChange={(e) => setNameFilter(e.target.value)}
              placeholder="Search store name..."
              className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Email Filter */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 mb-1 uppercase">
              Filter by Email
            </label>
            <input
              type="text"
              value={emailFilter}
              onChange={(e) => setEmailFilter(e.target.value)}
              placeholder="Search store email..."
              className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Address Filter */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 mb-1 uppercase">
              Filter by Address
            </label>
            <input
              type="text"
              value={addressFilter}
              onChange={(e) => setAddressFilter(e.target.value)}
              placeholder="Search store address..."
              className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </form>
      </div>

      {/* Stores Data Table */}
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
                  onClick={() => handleSort('email')}
                  className="py-3.5 px-4 cursor-pointer hover:bg-slate-100/80 transition group"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Email</span>
                    {renderSortIcon('email')}
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
                  onClick={() => handleSort('rating')}
                  className="py-3.5 px-4 cursor-pointer hover:bg-slate-100/80 transition group"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Overall Rating</span>
                    {renderSortIcon('rating')}
                  </div>
                </th>

                <th className="py-3.5 px-4">Assigned Store Owner</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan="5" className="py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-7 h-7 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-xs font-medium">Loading stores...</span>
                    </div>
                  </td>
                </tr>
              ) : stores.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-12 text-center text-slate-500">
                    <div className="max-w-xs mx-auto text-center space-y-2">
                      <Building2 className="w-8 h-8 mx-auto text-slate-300" />
                      <p className="font-semibold text-slate-700 text-sm">No stores found</p>
                      <p className="text-xs text-slate-400">
                        Try adjusting your filters or add a new store.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                stores.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3.5 px-4 font-semibold text-slate-900 max-w-[220px] truncate">
                      {s.name}
                    </td>

                    <td className="py-3.5 px-4 text-slate-600">{s.email}</td>

                    <td className="py-3.5 px-4 text-slate-600 max-w-[280px] truncate" title={s.address}>
                      {s.address}
                    </td>

                    <td className="py-3.5 px-4">
                      <StarRating rating={s.rating} count={s.totalRatings} size="sm" />
                    </td>

                    <td className="py-3.5 px-4">
                      {s.owner ? (
                        <div className="flex items-center gap-1.5">
                          <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-[10px] font-bold">
                            {s.owner.name.charAt(0)}
                          </div>
                          <div>
                            <span className="font-semibold text-slate-800 block text-xs truncate max-w-[150px]">
                              {s.owner.name}
                            </span>
                            <span className="text-[10px] text-slate-400 block truncate max-w-[150px]">
                              {s.owner.email}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic text-[11px]">Unassigned</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Summary */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 flex justify-between items-center">
          <span>
            Showing <strong className="text-slate-800">{stores.length}</strong> stores
          </span>
          <span>Sorted by: <strong className="text-slate-800">{sortBy}</strong> ({sortOrder})</span>
        </div>
      </div>

      {/* Add Store Modal */}
      <AddStoreModal
        isOpen={isAddStoreOpen}
        onClose={() => setIsAddStoreOpen(false)}
        onStoreCreated={handleStoreCreated}
      />
    </div>
  );
};
