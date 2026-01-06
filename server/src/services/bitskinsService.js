const axios = require('axios');

const BITSKINS_API_BASE = 'https://api.bitskins.com';
const API_KEY = process.env.BITSKINS_API_KEY;

// Create axios instance for Bitskins
const bitskinsApi = axios.create({
  baseURL: BITSKINS_API_BASE,
  headers: {
    'x-apikey': API_KEY || ''
  }
});

// Get listings from Bitskins
const getListings = async (filters = {}) => {
  try {
    const requestBody = {
      limit: 100,
      offset: 0
    };

    // Map filters to Bitskins API parameters
    if (filters.search) {
      requestBody.skin_name = filters.search;
    }
    if (filters.minPrice) {
      requestBody.price_from = filters.minPrice / 100; // Convert cents to dollars
    }
    if (filters.maxPrice) {
      requestBody.price_to = filters.maxPrice / 100;
    }
    if (filters.minFloat !== undefined) {
      requestBody.float_value_from = filters.minFloat;
    }
    if (filters.maxFloat !== undefined) {
      requestBody.float_value_to = filters.maxFloat;
    }

    // Map conditions to Bitskins exterior_id
    if (filters.conditions && filters.conditions.length > 0) {
      const exteriorIds = filters.conditions.map(cond => {
        switch (cond.toLowerCase()) {
          case 'fn': return 1;
          case 'mw': return 2;
          case 'ft': return 3;
          case 'ww': return 4;
          case 'bs': return 5;
          default: return null;
        }
      }).filter(id => id !== null);
      
      if (exteriorIds.length > 0) {
        requestBody.exterior_id = exteriorIds;
      }
    }

    const response = await bitskinsApi.post('/market/search/730', requestBody);
    
    // Normalize data to common format
    let items = (response.data.list || response.data.items || response.data || []).map(normalizeItem);
    
    // Apply additional local filters
    items = applyLocalFilters(items, filters);
    
    return items;
  } catch (err) {
    console.error('Bitskins API error:', err.message);
    return [];
  }
};

// Check if a specific listing exists
const checkListingExists = async (listingId) => {
  try {
    const response = await bitskinsApi.get(`/market/item/730/${listingId}`);
    return response.status === 200 && response.data;
  } catch (err) {
    return false;
  }
};

// Normalize Bitskins item to common format
const normalizeItem = (item) => {
  return {
    marketplace: 'bitskins',
    listing_id: item.id || item.asset_id || String(item.item_id),
    market_hash_name: item.market_hash_name || item.skin_name,
    item_name: extractItemName(item.market_hash_name || item.skin_name),
    price_cents: Math.round((item.price || 0) * 100),
    float_value: item.float_value || item.floatvalue || null,
    exterior: getExteriorFromId(item.exterior_id) || getExteriorFromFloat(item.float_value),
    is_stattrak: item.is_stattrak || item.stattrak || false,
    is_souvenir: item.is_souvenir || item.souvenir || false,
    rarity: item.rarity || item.quality || 'unknown',
    icon_url: item.image || item.icon_url || getIconUrl(item.market_hash_name),
    listing_url: `https://bitskins.com/item/730/${item.id || item.asset_id}`,
    stickers: item.stickers || []
  };
};

// Extract item name from market hash name
const extractItemName = (marketHashName) => {
  if (!marketHashName) return '';
  return marketHashName.replace(/\s*\([^)]+\)\s*$/, '');
};

// Get exterior from Bitskins exterior_id
const getExteriorFromId = (exteriorId) => {
  switch (exteriorId) {
    case 1: return 'Factory New';
    case 2: return 'Minimal Wear';
    case 3: return 'Field-Tested';
    case 4: return 'Well-Worn';
    case 5: return 'Battle-Scarred';
    default: return null;
  }
};

// Get exterior from float value
const getExteriorFromFloat = (floatValue) => {
  if (floatValue === undefined || floatValue === null) return 'Unknown';
  if (floatValue < 0.07) return 'Factory New';
  if (floatValue < 0.15) return 'Minimal Wear';
  if (floatValue < 0.38) return 'Field-Tested';
  if (floatValue < 0.45) return 'Well-Worn';
  return 'Battle-Scarred';
};

// Get icon URL
const getIconUrl = (marketHashName) => {
  if (!marketHashName) return '';
  const encoded = encodeURIComponent(marketHashName);
  return `https://steamcommunity-a.akamaihd.net/economy/image/class/730/${encoded}/200fx200f`;
};

// Apply local filters
const applyLocalFilters = (items, filters) => {
  let filtered = [...items];

  // Type filter
  if (filters.type) {
    switch (filters.type.toLowerCase()) {
      case 'stattrak':
        filtered = filtered.filter(item => item.is_stattrak);
        break;
      case 'souvenir':
        filtered = filtered.filter(item => item.is_souvenir);
        break;
      case 'normal':
        filtered = filtered.filter(item => !item.is_stattrak && !item.is_souvenir);
        break;
    }
  }

  return filtered;
};

module.exports = {
  getListings,
  checkListingExists,
  normalizeItem
};
