import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Store,
  User,
  ShieldCheck,
  KeyRound,
  LogOut,
  ChevronDown,
  LayoutDashboard,
  Users,
  Building2,
  Star,
} from 'lucide-react';

export const Navbar = () => {
  const { user, logout, isAdmin, isStoreOwner, isNormalUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getRoleBadge = () => {
    if (isAdmin) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-800 border border-purple-200">
          <ShieldCheck className="w-3.5 h-3.5" />
          System Admin
        </span>
      );
    }
    if (isStoreOwner) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
          <Store className="w-3.5 h-3.5" />
          Store Owner
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200">
        <User className="w-3.5 h-3.5" />
        Normal User
      </span>
    );
  };

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo & Navigation */}
          <div className="flex items-center gap-8">
            <Link
              to={
                isAdmin
                  ? '/admin/dashboard'
                  : isStoreOwner
                  ? '/owner/dashboard'
                  : '/user/dashboard'
              }
              className="flex items-center gap-2.5 font-bold text-xl text-indigo-600 hover:text-indigo-700 transition"
            >
              <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-200">
                <Store className="w-5 h-5" />
              </div>
              <span className="tracking-tight text-slate-900 font-extrabold">
                Rate<span className="text-indigo-600">Hub</span>
              </span>
            </Link>

            {/* Navigation links per role */}
            {user && (
              <div className="hidden md:flex items-center space-x-1">
                {isAdmin && (
                  <>
                    <Link
                      to="/admin/dashboard"
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition ${
                        location.pathname === '/admin/dashboard'
                          ? 'bg-indigo-50 text-indigo-700 font-semibold'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                      }`}
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      Dashboard
                    </Link>
                    <Link
                      to="/admin/users"
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition ${
                        location.pathname === '/admin/users'
                          ? 'bg-indigo-50 text-indigo-700 font-semibold'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                      }`}
                    >
                      <Users className="w-4 h-4" />
                      Users
                    </Link>
                    <Link
                      to="/admin/stores"
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition ${
                        location.pathname === '/admin/stores'
                          ? 'bg-indigo-50 text-indigo-700 font-semibold'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                      }`}
                    >
                      <Building2 className="w-4 h-4" />
                      Stores
                    </Link>
                  </>
                )}

                {isNormalUser && (
                  <Link
                    to="/user/dashboard"
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition ${
                      location.pathname === '/user/dashboard'
                        ? 'bg-indigo-50 text-indigo-700 font-semibold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <Store className="w-4 h-4" />
                    Browse & Rate Stores
                  </Link>
                )}

                {isStoreOwner && (
                  <Link
                    to="/owner/dashboard"
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition ${
                      location.pathname === '/owner/dashboard'
                        ? 'bg-indigo-50 text-indigo-700 font-semibold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <Star className="w-4 h-4" />
                    Store Ratings Dashboard
                  </Link>
                )}
              </div>
            )}
          </div>

          {/* Right Side - User Menu & Logout */}
          <div className="flex items-center gap-3">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2.5 p-1.5 pl-3 rounded-full hover:bg-slate-100 border border-slate-200 transition focus:outline-none"
                >
                  <div className="flex flex-col text-left hidden sm:block">
                    <span className="text-xs font-semibold text-slate-800 line-clamp-1 max-w-[150px]">
                      {user.name}
                    </span>
                    <span className="text-[11px] text-slate-500 line-clamp-1 max-w-[150px]">
                      {user.email}
                    </span>
                  </div>
                  {getRoleBadge()}
                  <ChevronDown className="w-4 h-4 text-slate-500" />
                </button>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setDropdownOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-64 rounded-xl bg-white shadow-xl ring-1 ring-black ring-opacity-5 py-2 z-20 divide-y divide-slate-100 border border-slate-100">
                      <div className="px-4 py-3">
                        <p className="text-sm font-bold text-slate-900 truncate">
                          {user.name}
                        </p>
                        <p className="text-xs text-slate-500 truncate">{user.email}</p>
                        <div className="mt-2 text-xs text-slate-500 bg-slate-50 p-2 rounded-lg border border-slate-100">
                          <span className="font-medium text-slate-700">Address: </span>
                          <span className="line-clamp-2">{user.address}</span>
                        </div>
                      </div>

                      <div className="py-1">
                        <Link
                          to="/change-password"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition"
                        >
                          <KeyRound className="w-4 h-4 text-slate-500" />
                          Change Password
                        </Link>
                      </div>

                      <div className="py-1">
                        <button
                          onClick={() => {
                            setDropdownOpen(false);
                            handleLogout();
                          }}
                          className="flex w-full items-center gap-2 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 transition font-medium"
                        >
                          <LogOut className="w-4 h-4" />
                          Log Out
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-indigo-600"
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
