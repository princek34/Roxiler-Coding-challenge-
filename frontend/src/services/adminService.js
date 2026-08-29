import api from './api';

export const adminService = {
  getDashboardStats: async () => {
    const response = await api.get('/admin/dashboard');
    return response.data;
  },

  getUsers: async (params = {}) => {
    const response = await api.get('/admin/users', { params });
    return response.data;
  },

  getUserById: async (id) => {
    const response = await api.get(`/admin/users/${id}`);
    return response.data;
  },

  createUser: async (userData) => {
    const response = await api.post('/admin/users', userData);
    return response.data;
  },

  getStores: async (params = {}) => {
    const response = await api.get('/admin/stores', { params });
    return response.data;
  },

  createStore: async (storeData) => {
    const response = await api.post('/admin/stores', storeData);
    return response.data;
  },

  getStoreOwners: async () => {
    const response = await api.get('/admin/store-owners');
    return response.data;
  },
};
