import React, { useState } from 'react';
import { Modal } from '../../components/Modal';
import {
  validateName,
  validateEmail,
  validateAddress,
  validatePassword,
  getPasswordChecks,
} from '../../utils/validation';
import {
  User,
  Mail,
  MapPin,
  Lock,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from 'lucide-react';

export const AddUserModal = ({ isOpen, onClose, onUserCreated }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    address: '',
    role: 'NORMAL_USER',
  });

  const [touched, setTouched] = useState({
    name: false,
    email: false,
    password: false,
    address: false,
  });

  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const nameError = touched.name ? validateName(formData.name) : null;
  const emailError = touched.email ? validateEmail(formData.email) : null;
  const addressError = touched.address ? validateAddress(formData.address) : null;
  const passwordError = touched.password ? validatePassword(formData.password) : null;
  const passwordChecks = getPasswordChecks(formData.password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    setTouched({
      name: true,
      email: true,
      password: true,
      address: true,
    });

    const valName = validateName(formData.name);
    const valEmail = validateEmail(formData.email);
    const valAddress = validateAddress(formData.address);
    const valPass = validatePassword(formData.password);

    if (valName || valEmail || valAddress || valPass) {
      setError(valName || valEmail || valAddress || valPass);
      return;
    }

    try {
      setIsSubmitting(true);
      await onUserCreated(formData);
      // Reset form
      setFormData({
        name: '',
        email: '',
        password: '',
        address: '',
        role: 'NORMAL_USER',
      });
      setTouched({
        name: false,
        email: false,
        password: false,
        address: false,
      });
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to create user.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New User">
      {error && (
        <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-rose-700 text-xs">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3.5 text-left">
        {/* Role Selector */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">
            User Role
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'NORMAL_USER', label: 'Normal User' },
              { id: 'STORE_OWNER', label: 'Store Owner' },
              { id: 'SYSTEM_ADMIN', label: 'Admin' },
            ].map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, role: r.id }))}
                className={`py-2 px-3 rounded-xl text-xs font-semibold border text-center transition ${
                  formData.role === r.id
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>

        {/* Name */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Full Name
            </label>
            <span
              className={`text-[11px] font-medium ${
                formData.name.length >= 20 && formData.name.length <= 60
                  ? 'text-emerald-600'
                  : 'text-slate-400'
              }`}
            >
              {formData.name.length}/60 (min 20)
            </span>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <User className="w-4 h-4" />
            </div>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              onBlur={() => handleBlur('name')}
              placeholder="e.g. Richard Feynman Senior Admin"
              maxLength={60}
              className={`w-full pl-9 pr-3 py-2 bg-slate-50 border rounded-xl text-slate-900 text-xs focus:outline-none focus:ring-2 focus:bg-white transition ${
                nameError
                  ? 'border-rose-400 focus:ring-rose-400'
                  : 'border-slate-200 focus:ring-indigo-500'
              }`}
            />
          </div>
          {nameError && (
            <p className="mt-1 text-[11px] text-rose-600 flex items-center gap-1">
              <XCircle className="w-3 h-3" />
              {nameError}
            </p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">
            Email Address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Mail className="w-4 h-4" />
            </div>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={() => handleBlur('email')}
              placeholder="name@example.com"
              className={`w-full pl-9 pr-3 py-2 bg-slate-50 border rounded-xl text-slate-900 text-xs focus:outline-none focus:ring-2 focus:bg-white transition ${
                emailError
                  ? 'border-rose-400 focus:ring-rose-400'
                  : 'border-slate-200 focus:ring-indigo-500'
              }`}
            />
          </div>
          {emailError && (
            <p className="mt-1 text-[11px] text-rose-600 flex items-center gap-1">
              <XCircle className="w-3 h-3" />
              {emailError}
            </p>
          )}
        </div>

        {/* Address */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Address
            </label>
            <span
              className={`text-[11px] font-medium ${
                formData.address.length > 400 ? 'text-rose-600' : 'text-slate-400'
              }`}
            >
              {formData.address.length}/400 max
            </span>
          </div>
          <div className="relative">
            <div className="absolute top-2.5 left-3 pointer-events-none text-slate-400">
              <MapPin className="w-4 h-4" />
            </div>
            <textarea
              name="address"
              rows={2}
              value={formData.address}
              onChange={handleChange}
              onBlur={() => handleBlur('address')}
              placeholder="Address details (Max 400 characters)"
              maxLength={400}
              className={`w-full pl-9 pr-3 py-2 bg-slate-50 border rounded-xl text-slate-900 text-xs focus:outline-none focus:ring-2 focus:bg-white transition ${
                addressError
                  ? 'border-rose-400 focus:ring-rose-400'
                  : 'border-slate-200 focus:ring-indigo-500'
              }`}
            />
          </div>
          {addressError && (
            <p className="mt-1 text-[11px] text-rose-600 flex items-center gap-1">
              <XCircle className="w-3 h-3" />
              {addressError}
            </p>
          )}
        </div>

        {/* Password */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">
            Password (8-16 Chars, 1 Uppercase, 1 Special)
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Lock className="w-4 h-4" />
            </div>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              onBlur={() => handleBlur('password')}
              placeholder="e.g. Secret@123"
              maxLength={16}
              className={`w-full pl-9 pr-3 py-2 bg-slate-50 border rounded-xl text-slate-900 text-xs focus:outline-none focus:ring-2 focus:bg-white transition ${
                passwordError
                  ? 'border-rose-400 focus:ring-rose-400'
                  : 'border-slate-200 focus:ring-indigo-500'
              }`}
            />
          </div>

          <div className="mt-2 p-2.5 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-3 gap-1 text-[11px]">
            <span
              className={`flex items-center gap-1 ${
                passwordChecks.length ? 'text-emerald-700 font-semibold' : 'text-slate-500'
              }`}
            >
              {passwordChecks.length ? '✓' : '•'} 8-16 chars
            </span>
            <span
              className={`flex items-center gap-1 ${
                passwordChecks.hasUppercase ? 'text-emerald-700 font-semibold' : 'text-slate-500'
              }`}
            >
              {passwordChecks.hasUppercase ? '✓' : '•'} 1+ Uppercase
            </span>
            <span
              className={`flex items-center gap-1 ${
                passwordChecks.hasSpecial ? 'text-emerald-700 font-semibold' : 'text-slate-500'
              }`}
            >
              {passwordChecks.hasSpecial ? '✓' : '•'} 1+ Special
            </span>
          </div>
        </div>

        <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md shadow-indigo-600/20 transition flex items-center gap-2 disabled:opacity-60"
          >
            {isSubmitting ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Creating...</span>
              </>
            ) : (
              <span>Create User</span>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};
