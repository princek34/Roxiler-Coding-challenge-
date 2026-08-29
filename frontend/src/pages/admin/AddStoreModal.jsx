import React, { useState, useEffect } from 'react';
import { Modal } from '../../components/Modal';
import { adminService } from '../../services/adminService';
import {
  validateName,
  validateEmail,
  validateAddress,
} from '../../utils/validation';
import {
  Store,
  Mail,
  MapPin,
  User,
  XCircle,
  AlertCircle,
} from 'lucide-react';

export const AddStoreModal = ({ isOpen, onClose, onStoreCreated }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    ownerId: '',
  });

  const [touched, setTouched] = useState({
    name: false,
    email: false,
    address: false,
  });

  const [owners, setOwners] = useState([]);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchStoreOwners();
    }
  }, [isOpen]);

  const fetchStoreOwners = async () => {
    try {
      const data = await adminService.getStoreOwners();
      if (data.success) {
        setOwners(data.owners || []);
      }
    } catch (err) {
      console.error('Failed to load store owners:', err);
    }
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    setTouched({
      name: true,
      email: true,
      address: true,
    });

    const valName = validateName(formData.name);
    const valEmail = validateEmail(formData.email);
    const valAddress = validateAddress(formData.address);

    if (valName || valEmail || valAddress) {
      setError(valName || valEmail || valAddress);
      return;
    }

    try {
      setIsSubmitting(true);
      await onStoreCreated({
        name: formData.name,
        email: formData.email,
        address: formData.address,
        ownerId: formData.ownerId ? parseInt(formData.ownerId, 10) : null,
      });

      // Reset
      setFormData({
        name: '',
        email: '',
        address: '',
        ownerId: '',
      });
      setTouched({
        name: false,
        email: false,
        address: false,
      });
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to create store.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Store">
      {error && (
        <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-rose-700 text-xs">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3.5 text-left">
        {/* Store Name */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Store Name
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
              <Store className="w-4 h-4" />
            </div>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              onBlur={() => handleBlur('name')}
              placeholder="e.g. Paramount Luxury Electronics & Gadgets"
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

        {/* Store Email */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">
            Store Email Address
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
              placeholder="contact@storename.com"
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

        {/* Store Address */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Store Address
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
              placeholder="Full store street address, City, District"
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

        {/* Assign Store Owner (Optional) */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">
            Assign Store Owner (Optional)
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <User className="w-4 h-4" />
            </div>
            <select
              name="ownerId"
              value={formData.ownerId}
              onChange={handleChange}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
            >
              <option value="">-- No Owner (Can assign later) --</option>
              {owners.map((owner) => (
                <option
                  key={owner.id}
                  value={owner.id}
                  disabled={!!owner.ownedStore}
                >
                  {owner.name} ({owner.email}) {owner.ownedStore ? `[Already owns: ${owner.ownedStore.name}]` : '[Available]'}
                </option>
              ))}
            </select>
          </div>
          <p className="mt-1 text-[11px] text-slate-500">
            Select a registered user with role <span className="font-semibold text-emerald-700">STORE_OWNER</span>.
          </p>
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
                <span>Creating Store...</span>
              </>
            ) : (
              <span>Create Store</span>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};
