import React, { useState, useEffect } from 'react';
import { Modal } from '../../components/Modal';
import { StarRating } from '../../components/StarRating';
import { ratingService } from '../../services/ratingService';
import { Store, Star, CheckCircle2, AlertCircle } from 'lucide-react';

export const RateStoreModal = ({ isOpen, onClose, store, onRatingSaved }) => {
  const [selectedRating, setSelectedRating] = useState(store?.myRating || 0);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (store) {
      setSelectedRating(store.myRating || 0);
      setError('');
    }
  }, [store]);

  if (!store) return null;

  const isModifying = store.myRating !== null && store.myRating > 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!selectedRating || selectedRating < 1 || selectedRating > 5) {
      setError('Please select a star rating between 1 and 5.');
      return;
    }

    try {
      setIsSubmitting(true);
      await ratingService.submitOrUpdateRating(store.id, selectedRating);
      onRatingSaved();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to submit rating.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isModifying ? 'Modify Your Store Rating' : 'Submit Store Rating'}
      maxWidth="max-w-md"
    >
      <div className="space-y-4 text-left">
        {/* Store Summary Header */}
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-extrabold text-slate-900 leading-snug">
                {store.name}
              </h4>
              <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                {store.address}
              </p>
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-slate-200/60 flex items-center justify-between text-xs text-slate-600">
            <span>Overall Store Rating:</span>
            <StarRating
              rating={store.overallRating}
              count={store.totalRatings}
              size="sm"
            />
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-rose-700 text-xs">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="text-center py-4 bg-amber-50/50 rounded-2xl border border-amber-100">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Select Your Rating (1 - 5 Stars)
            </label>
            <div className="flex justify-center">
              <StarRating
                rating={selectedRating}
                interactive={true}
                onChange={(val) => setSelectedRating(val)}
                size="xl"
                showValue={false}
              />
            </div>
            <p className="text-xs text-amber-700 font-semibold mt-2">
              {selectedRating > 0
                ? `Selected: ${selectedRating} of 5 Stars`
                : 'Click a star above to rate'}
            </p>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !selectedRating}
              className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md shadow-indigo-600/20 transition flex items-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Star className="w-3.5 h-3.5" />
                  <span>{isModifying ? 'Update Rating' : 'Submit Rating'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};
