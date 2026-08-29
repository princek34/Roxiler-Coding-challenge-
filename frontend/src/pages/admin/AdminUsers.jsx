import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { StarRating } from '../../components/StarRating';
import { AddUserModal } from './AddUserModal';
import { UserDetailsModal } from './UserDetailsModal';
import {
  Users,
  UserPlus,
  Search,
  Filter,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Eye,
  ShieldCheck,
  Store,
  User as UserIcon,
  RefreshCw,
} from 'lucide-react';

export const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filters
  const [search, setSearch] = useState('');
  const [nameFilter, setNameFilter] = useState('');
  const [emailFilter, setEmailFilter] = useState('');
  const [addressFilter, setAddressFilter] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  // Sorting
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('DESC');

  // Modals
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [successToast, setSuccessToast] = useState('');

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError('');
      const params = {
        search: search || undefined,
        name: nameFilter || undefined,
        email: emailFilter || undefined,
        address: addressFilter || undefined,
        role: roleFilter || undefined,
        sortBy,
        sortOrder,
      };

      const data = await adminService.getUsers(params);
      if (data.success) {
        setUsers(data.users || []);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch users list.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [nameFilter, emailFilter, addressFilter, roleFilter, sortBy, sortOrder]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchUsers();
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'ASC' ? 'DESC' : 'ASC');
    } else {
      setSortBy(field);
      setSortOrder('ASC');
    }
  };

  const handleUserCreated = async (userData) => {
    await adminService.createUser(userData);
    setSuccessToast(`User "${userData.name}" was created successfully!`);
    setTimeout(() => setSuccessToast(''), 4000);
    fetchUsers();
  };

  const openUserDetails = (user) => {
    setSelectedUser(user);
    setIsDetailsOpen(true);
  };

  const getRoleBadge = (role) => {
    if (role === 'SYSTEM_ADMIN') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-800 border border-purple-200">
          <ShieldCheck className="w-3 h-3" />
          Admin
        </span>
      );
    }
    if (role === 'STORE_OWNER') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
          <Store className="w-3 h-3" />
          Store Owner
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">
        <UserIcon className="w-3 h-3" />
        Normal User
      </span>
    );
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
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900">User Management</h2>
              <p className="text-xs text-slate-500">
                View, filter, sort, inspect, and add system users & store owners
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchUsers}
            title="Refresh List"
            className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={() => setIsAddUserOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-xs font-bold rounded-xl shadow-md shadow-indigo-600/20 transition"
          >
            <UserPlus className="w-4 h-4" />
            Add New User
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 uppercase tracking-wider">
            <Filter className="w-3.5 h-3.5 text-indigo-600" />
            <span>Search & Filter Filters</span>
          </div>

          {(search || nameFilter || emailFilter || addressFilter || roleFilter) && (
            <button
              onClick={() => {
                setSearch('');
                setNameFilter('');
                setEmailFilter('');
                setAddressFilter('');
                setRoleFilter('');
              }}
              className="text-xs font-semibold text-rose-600 hover:text-rose-700"
            >
              Clear All Filters
            </button>
          )}
        </div>

        <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* General Search */}
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
              placeholder="Search by name..."
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
              placeholder="Search by email..."
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
              placeholder="Search by address..."
              className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Role Filter */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 mb-1 uppercase">
              Filter by Role
            </label>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">All User Roles</option>
              <option value="NORMAL_USER">Normal Users</option>
              <option value="STORE_OWNER">Store Owners</option>
              <option value="SYSTEM_ADMIN">System Admins</option>
            </select>
          </div>
        </form>
      </div>

      {/* Users Data Table */}
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
                    <span>Name</span>
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
                  onClick={() => handleSort('role')}
                  className="py-3.5 px-4 cursor-pointer hover:bg-slate-100/80 transition group"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Role</span>
                    {renderSortIcon('role')}
                  </div>
                </th>

                <th
                  onClick={() => handleSort('storeRating')}
                  className="py-3.5 px-4 cursor-pointer hover:bg-slate-100/80 transition group"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Store Rating (If Owner)</span>
                    {renderSortIcon('storeRating')}
                  </div>
                </th>

                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-7 h-7 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-xs font-medium">Loading users...</span>
                    </div>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-500">
                    <div className="max-w-xs mx-auto text-center space-y-2">
                      <Users className="w-8 h-8 mx-auto text-slate-300" />
                      <p className="font-semibold text-slate-700 text-sm">No users found</p>
                      <p className="text-xs text-slate-400">
                        Try adjusting your filters or add a new user.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3.5 px-4 font-semibold text-slate-900 max-w-[200px] truncate">
                      {u.name}
                    </td>

                    <td className="py-3.5 px-4 text-slate-600">{u.email}</td>

                    <td className="py-3.5 px-4 text-slate-600 max-w-[250px] truncate" title={u.address}>
                      {u.address}
                    </td>

                    <td className="py-3.5 px-4">{getRoleBadge(u.role)}</td>

                    <td className="py-3.5 px-4">
                      {u.role === 'STORE_OWNER' ? (
                        u.store ? (
                          <div className="flex flex-col">
                            <span className="text-[11px] font-semibold text-slate-900 truncate max-w-[160px]">
                              {u.store.name}
                            </span>
                            <StarRating
                              rating={u.storeRating !== null ? u.storeRating : 0}
                              count={u.storeRatingCount || 0}
                              size="sm"
                            />
                          </div>
                        ) : (
                          <span className="text-slate-400 italic text-[11px]">
                            No store assigned
                          </span>
                        )
                      ) : (
                        <span className="text-slate-300 font-medium">—</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => openUserDetails(u)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 text-xs font-semibold transition"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        Details
                      </button>
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
            Showing <strong className="text-slate-800">{users.length}</strong> users
          </span>
          <span>Sorted by: <strong className="text-slate-800">{sortBy}</strong> ({sortOrder})</span>
        </div>
      </div>

      {/* Add User Modal */}
      <AddUserModal
        isOpen={isAddUserOpen}
        onClose={() => setIsAddUserOpen(false)}
        onUserCreated={handleUserCreated}
      />

      {/* User Details Modal */}
      <UserDetailsModal
        isOpen={isDetailsOpen}
        onClose={() => {
          setIsDetailsOpen(false);
          setSelectedUser(null);
        }}
        user={selectedUser}
      />
    </div>
  );
};
