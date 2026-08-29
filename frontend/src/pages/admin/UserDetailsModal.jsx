import React from 'react';
import { Modal } from '../../components/Modal';
import { StarRating } from '../../components/StarRating';
import {
  User,
  Mail,
  MapPin,
  ShieldCheck,
  Store,
  Calendar,
  Star,
} from 'lucide-react';

export const UserDetailsModal = ({ isOpen, onClose, user }) => {
  if (!user) return null;

  const getRoleBadge = (role) => {
    if (role === 'SYSTEM_ADMIN') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-800 border border-purple-200">
          <ShieldCheck className="w-3.5 h-3.5" />
          System Administrator
        </span>
      );
    }
    if (role === 'STORE_OWNER') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
          <Store className="w-3.5 h-3.5" />
          Store Owner
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">
        <User className="w-3.5 h-3.5" />
        Normal User
      </span>
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="User Profile Details">
      <div className="space-y-4 text-left">
        {/* User Top Card */}
        <div className="flex items-start justify-between p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center text-lg font-bold shadow-md shadow-indigo-200">
              {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div>
              <h4 className="text-base font-extrabold text-slate-900 leading-snug">
                {user.name}
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">{user.email}</p>
            </div>
          </div>
          {getRoleBadge(user.role)}
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 gap-3 text-xs">
          <div className="p-3 bg-white rounded-xl border border-slate-200">
            <div className="flex items-center gap-1.5 text-slate-400 font-semibold uppercase tracking-wider mb-1">
              <MapPin className="w-3.5 h-3.5 text-slate-500" />
              <span>Full Address</span>
            </div>
            <p className="text-slate-800 text-xs leading-relaxed font-medium">
              {user.address || 'No address provided'}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-white rounded-xl border border-slate-200">
              <div className="flex items-center gap-1.5 text-slate-400 font-semibold uppercase tracking-wider mb-1">
                <ShieldCheck className="w-3.5 h-3.5 text-slate-500" />
                <span>Account Role</span>
              </div>
              <p className="text-slate-800 text-xs font-bold">{user.role}</p>
            </div>

            <div className="p-3 bg-white rounded-xl border border-slate-200">
              <div className="flex items-center gap-1.5 text-slate-400 font-semibold uppercase tracking-wider mb-1">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                <span>Registered On</span>
              </div>
              <p className="text-slate-800 text-xs font-medium">
                {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
              </p>
            </div>
          </div>
        </div>

        {/* Store Owner Special Section */}
        {user.role === 'STORE_OWNER' && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs uppercase tracking-wider">
                <Store className="w-4 h-4 text-emerald-700" />
                <span>Assigned Store Details & Rating</span>
              </div>
            </div>

            {user.store || user.ownedStore ? (
              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center bg-white p-2.5 rounded-xl border border-emerald-100">
                  <span className="font-semibold text-slate-700">Store Name:</span>
                  <span className="font-extrabold text-slate-900">
                    {(user.store || user.ownedStore).name}
                  </span>
                </div>
                <div className="flex justify-between items-center bg-white p-2.5 rounded-xl border border-emerald-100">
                  <span className="font-semibold text-slate-700">Store Rating:</span>
                  <StarRating
                    rating={user.storeRating !== null ? user.storeRating : 0}
                    count={user.storeRatingCount || 0}
                    size="sm"
                  />
                </div>
                <div className="bg-white p-2.5 rounded-xl border border-emerald-100 text-slate-600">
                  <span className="font-semibold text-slate-700 block mb-0.5">
                    Store Location:
                  </span>
                  {(user.store || user.ownedStore).address}
                </div>
              </div>
            ) : (
              <p className="text-xs text-emerald-800 italic">
                No store has been assigned to this owner yet.
              </p>
            )}
          </div>
        )}

        <div className="pt-2 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded-xl transition"
          >
            Close Details
          </button>
        </div>
      </div>
    </Modal>
  );
};
