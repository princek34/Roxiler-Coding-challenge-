import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  validateName,
  validateEmail,
  validateAddress,
  validatePassword,
  getPasswordChecks,
} from '../utils/validation';
import {
  User,
  Mail,
  MapPin,
  Lock,
  ArrowRight,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Store,
} from 'lucide-react';

export const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    password: '',
  });

  const [touched, setTouched] = useState({
    name: false,
    email: false,
    address: false,
    password: false,
  });

  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { signup } = useAuth();
  const navigate = useNavigate();

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

  const isFormValid =
    !validateName(formData.name) &&
    !validateEmail(formData.email) &&
    !validateAddress(formData.address) &&
    !validatePassword(formData.password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Mark all as touched
    setTouched({
      name: true,
      email: true,
      address: true,
      password: true,
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
      await signup(formData);
      navigate('/user/dashboard', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Registration failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-lg">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-indigo-600 text-white shadow-xl shadow-indigo-500/30 mb-3 ring-4 ring-indigo-500/20">
            <Store className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Create Normal User Account
          </h1>
          <p className="text-xs text-slate-300 mt-1">
            Join RateHub to discover and submit ratings for verified stores
          </p>
        </div>

        {/* Signup Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 border border-slate-100">
          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-3 text-rose-700 text-sm animate-shake">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Field */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Full Name
                </label>
                <span
                  className={`text-[11px] font-medium ${
                    formData.name.length >= 2 && formData.name.length <= 60
                      ? 'text-emerald-600'
                      : 'text-slate-400'
                  }`}
                >
                  {formData.name.length}/60 chars max
                </span>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  onBlur={() => handleBlur('name')}
                  placeholder="e.g. Jonathan Edward"
                  maxLength={60}
                  className={`w-full pl-10 pr-4 py-2.5 bg-slate-50 border rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:bg-white transition ${
                    nameError
                      ? 'border-rose-400 focus:ring-rose-400 bg-rose-50/30'
                      : touched.name && !nameError && formData.name
                      ? 'border-emerald-400 focus:ring-emerald-400'
                      : 'border-slate-200 focus:ring-indigo-500'
                  }`}
                />
              </div>
              {nameError && (
                <p className="mt-1 text-xs text-rose-600 flex items-center gap-1">
                  <XCircle className="w-3.5 h-3.5" />
                  {nameError}
                </p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={() => handleBlur('email')}
                  placeholder="name@example.com"
                  className={`w-full pl-10 pr-4 py-2.5 bg-slate-50 border rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:bg-white transition ${
                    emailError
                      ? 'border-rose-400 focus:ring-rose-400 bg-rose-50/30'
                      : touched.email && !emailError && formData.email
                      ? 'border-emerald-400 focus:ring-emerald-400'
                      : 'border-slate-200 focus:ring-indigo-500'
                  }`}
                />
              </div>
              {emailError && (
                <p className="mt-1 text-xs text-rose-600 flex items-center gap-1">
                  <XCircle className="w-3.5 h-3.5" />
                  {emailError}
                </p>
              )}
            </div>

            {/* Address Field */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Address
                </label>
                <span
                  className={`text-[11px] font-medium ${
                    formData.address.length > 400 ? 'text-rose-600' : 'text-slate-400'
                  }`}
                >
                  {formData.address.length}/400 chars max
                </span>
              </div>
              <div className="relative">
                <div className="absolute top-3 left-3.5 pointer-events-none text-slate-400">
                  <MapPin className="w-4 h-4" />
                </div>
                <textarea
                  name="address"
                  rows={2}
                  value={formData.address}
                  onChange={handleChange}
                  onBlur={() => handleBlur('address')}
                  placeholder="e.g. 12 Blossom Way, Springfield Residential Area, City 1"
                  maxLength={400}
                  className={`w-full pl-10 pr-4 py-2 bg-slate-50 border rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:bg-white transition ${
                    addressError
                      ? 'border-rose-400 focus:ring-rose-400 bg-rose-50/30'
                      : touched.address && !addressError && formData.address
                      ? 'border-emerald-400 focus:ring-emerald-400'
                      : 'border-slate-200 focus:ring-indigo-500'
                  }`}
                />
              </div>
              {addressError && (
                <p className="mt-1 text-xs text-rose-600 flex items-center gap-1">
                  <XCircle className="w-3.5 h-3.5" />
                  {addressError}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={() => handleBlur('password')}
                  placeholder="••••••••••••"
                  maxLength={16}
                  className={`w-full pl-10 pr-4 py-2.5 bg-slate-50 border rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:bg-white transition ${
                    passwordError
                      ? 'border-rose-400 focus:ring-rose-400 bg-rose-50/30'
                      : touched.password && !passwordError && formData.password
                      ? 'border-emerald-400 focus:ring-emerald-400'
                      : 'border-slate-200 focus:ring-indigo-500'
                  }`}
                />
              </div>

              {/* Live Password Requirements Checklist */}
              <div className="mt-2.5 p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                <p className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                  Password Requirements:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5 text-xs">
                  <div
                    className={`flex items-center gap-1.5 ${
                      passwordChecks.length ? 'text-emerald-700 font-medium' : 'text-slate-500'
                    }`}
                  >
                    {passwordChecks.length ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <div className="w-3.5 h-3.5 rounded-full border border-slate-300" />
                    )}
                    <span>8-16 Chars</span>
                  </div>

                  <div
                    className={`flex items-center gap-1.5 ${
                      passwordChecks.hasUppercase ? 'text-emerald-700 font-medium' : 'text-slate-500'
                    }`}
                  >
                    {passwordChecks.hasUppercase ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <div className="w-3.5 h-3.5 rounded-full border border-slate-300" />
                    )}
                    <span>1+ Uppercase (A-Z)</span>
                  </div>

                  <div
                    className={`flex items-center gap-1.5 ${
                      passwordChecks.hasSpecial ? 'text-emerald-700 font-medium' : 'text-slate-500'
                    }`}
                  >
                    {passwordChecks.hasSpecial ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <div className="w-3.5 h-3.5 rounded-full border border-slate-300" />
                    )}
                    <span>1+ Special (!@#$)</span>
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-3 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-sm font-semibold rounded-xl shadow-lg shadow-indigo-600/30 transition duration-150 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span>Complete Registration</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-5 text-center text-xs text-slate-500">
            Already registered?{' '}
            <Link
              to="/login"
              className="text-indigo-600 hover:text-indigo-700 font-bold hover:underline"
            >
              Sign in to your account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
