import axios from 'axios';

const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Items API
export const itemsApi = {
  // Search items across all marketplaces
  search: async (params) => {
    const response = await api.get('/items', { params });
    return response.data;
  },

  // Get items from a specific marketplace
  getByMarketplace: async (marketplace, params) => {
    const response = await api.get(`/items/${marketplace}`, { params });
    return response.data;
  },

  // Refresh items (fetch fresh data from APIs)
  refresh: async (params) => {
    const response = await api.get('/items/refresh', { params });
    return response.data;
  }
};

// Watchlist API
export const watchlistApi = {
  // Get user's watchlist
  getAll: async (userToken) => {
    const response = await api.get('/watchlist', {
      headers: { 'X-User-Token': userToken }
    });
    return response.data;
  },

  // Add item to watchlist
  add: async (userToken, item) => {
    const response = await api.post('/watchlist', item, {
      headers: { 'X-User-Token': userToken }
    });
    return response.data;
  },

  // Remove item from watchlist
  remove: async (userToken, marketplace, listingId) => {
    const response = await api.delete(`/watchlist/${marketplace}/${listingId}`, {
      headers: { 'X-User-Token': userToken }
    });
    return response.data;
  },

  // Check if item is in watchlist
  check: async (userToken, marketplace, listingId) => {
    const response = await api.get(`/watchlist/check/${marketplace}/${listingId}`, {
      headers: { 'X-User-Token': userToken }
    });
    return response.data;
  },

  // Refresh watchlist (remove stale items)
  refresh: async (userToken) => {
    const response = await api.post('/watchlist/refresh', {}, {
      headers: { 'X-User-Token': userToken }
    });
    return response.data;
  }
};

export default api;
