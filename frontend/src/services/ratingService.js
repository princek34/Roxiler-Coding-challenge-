import api from './api';

export const ratingService = {
  submitOrUpdateRating: async (storeId, rating) => {
    const response = await api.post('/ratings', { storeId, rating });
    return response.data;
  },

  modifyRating: async (ratingId, rating) => {
    const response = await api.put(`/ratings/${ratingId}`, { rating });
    return response.data;
  },

  getOwnerDashboard: async (params = {}) => {
    const response = await api.get('/ratings/owner-dashboard', { params });
    return response.data;
  },
};
