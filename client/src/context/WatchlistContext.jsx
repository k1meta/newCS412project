import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { watchlistApi } from '../services/api';
import useUserToken from '../hooks/useUserToken';

const WatchlistContext = createContext();

export const useWatchlist = () => {
  const context = useContext(WatchlistContext);
  if (!context) {
    throw new Error('useWatchlist must be used within a WatchlistProvider');
  }
  return context;
};

export const WatchlistProvider = ({ children }) => {
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const userToken = useUserToken();

  // Fetch watchlist from server
  const fetchWatchlist = useCallback(async () => {
    if (!userToken) return;
    
    setLoading(true);
    setError(null);
    try {
      const data = await watchlistApi.getAll(userToken);
      setWatchlist(data.items || []);
    } catch (err) {
      setError(err.message);
      console.error('Failed to fetch watchlist:', err);
    } finally {
      setLoading(false);
    }
  }, [userToken]);

  // Load watchlist on mount and when userToken changes
  useEffect(() => {
    if (userToken) {
      fetchWatchlist();
    }
  }, [userToken, fetchWatchlist]);

  // Add item to watchlist
  const addToWatchlist = async (item) => {
    if (!userToken) return;

    try {
      await watchlistApi.add(userToken, item);
      setWatchlist((prev) => [...prev, item]);
    } catch (err) {
      setError(err.message);
      console.error('Failed to add to watchlist:', err);
      throw err;
    }
  };

  // Remove item from watchlist
  const removeFromWatchlist = async (marketplace, listingId) => {
    if (!userToken) return;

    try {
      await watchlistApi.remove(userToken, marketplace, listingId);
      setWatchlist((prev) => 
        prev.filter((item) => 
          !(item.marketplace === marketplace && item.listing_id === listingId)
        )
      );
    } catch (err) {
      setError(err.message);
      console.error('Failed to remove from watchlist:', err);
      throw err;
    }
  };

  // Check if item is in watchlist
  const isInWatchlist = (marketplace, listingId) => {
    return watchlist.some(
      (item) => item.marketplace === marketplace && item.listing_id === listingId
    );
  };

  // Toggle watchlist status
  const toggleWatchlist = async (item) => {
    const inWatchlist = isInWatchlist(item.marketplace, item.listing_id);
    
    if (inWatchlist) {
      await removeFromWatchlist(item.marketplace, item.listing_id);
    } else {
      await addToWatchlist(item);
    }
  };

  // Refresh watchlist (remove stale items)
  const refreshWatchlist = async () => {
    if (!userToken) return;

    setLoading(true);
    try {
      const data = await watchlistApi.refresh(userToken);
      setWatchlist(data.items || []);
      return data;
    } catch (err) {
      setError(err.message);
      console.error('Failed to refresh watchlist:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    watchlist,
    loading,
    error,
    addToWatchlist,
    removeFromWatchlist,
    isInWatchlist,
    toggleWatchlist,
    refreshWatchlist,
    fetchWatchlist
  };

  return (
    <WatchlistContext.Provider value={value}>
      {children}
    </WatchlistContext.Provider>
  );
};

export default WatchlistContext;
