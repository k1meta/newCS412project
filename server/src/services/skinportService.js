const axios = require('axios');

const SKINPORT_API_BASE = 'https://api.skinport.com/v1';
const API_KEY = process.env.SKINPORT_API_KEY;

// Create axios instance for Skinport
const skinportApi = axios.create({
  baseURL: SKINPORT_API_BASE,
  headers: {
    'Authorization': API_KEY ? `Bearer ${API_KEY}` : ''
  }
});

// Get listings from Skinport
const getListings = async (filters = {}) => {
  try {
    const params = {
      app_id: 730, // CS2
      currency: 'USD'
    };

    // Skinport uses different parameter names
    if (filters.search) {
      params.search = filters.search;
    }

    const response = await skinportApi.get('/items', { params });
    
    // Normalize data to common format
    let items = (response.data.items || response.data || []).map(normalizeItem);
    
    // Apply filters
    items = applyLocalFilters(items, filters);
    
    return items;
  } catch (err) {
    console.error('Skinport API error:', err.message);
    return [];
  }
};

// Check if a specific listing exists
const checkListingExists = async (listingId) => {
  try {
    const response = await skinportApi.get(`/items/${listingId}`);
    return response.status === 200;
  } catch (err) {
    return false;
  }
};

// Normalize Skinport item to common format
const normalizeItem = (item) => {
  return {
    marketplace: 'skinport',
    listing_id: item.id || item.asset_id || String(Math.random()),
    market_hash_name: item.market_hash_name,
    item_name: extractItemName(item.market_hash_name),
    price_cents: Math.round((item.min_price || item.suggested_price || 0) * 100),
    float_value: item.wear || null,
    exterior: item.exterior || getExteriorFromName(item.market_hash_name),
    is_stattrak: item.stattrak || item.market_hash_name?.includes('StatTrak') || false,
    is_souvenir: item.souvenir || item.market_hash_name?.includes('Souvenir') || false,
    rarity: item.rarity || 'unknown',
    icon_url: item.image || getIconUrl(item.market_hash_name),
    listing_url: `https://skinport.com/item/${encodeURIComponent(item.market_hash_name)}`,
    stickers: item.stickers || []
  };
};

// Extract item name from market hash name
const extractItemName = (marketHashName) => {
  if (!marketHashName) return '';
  return marketHashName.replace(/\s*\([^)]+\)\s*$/, '');
};

// Get exterior from market hash name
const getExteriorFromName = (marketHashName) => {
  if (!marketHashName) return 'Unknown';
  if (marketHashName.includes('Factory New')) return 'Factory New';
  if (marketHashName.includes('Minimal Wear')) return 'Minimal Wear';
  if (marketHashName.includes('Field-Tested')) return 'Field-Tested';
  if (marketHashName.includes('Well-Worn')) return 'Well-Worn';
  if (marketHashName.includes('Battle-Scarred')) return 'Battle-Scarred';
  return 'Unknown';
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

  // Price filters
  if (filters.minPrice) {
    filtered = filtered.filter(item => item.price_cents >= filters.minPrice);
  }
  if (filters.maxPrice) {
    filtered = filtered.filter(item => item.price_cents <= filters.maxPrice);
  }

  // Float filters
  if (filters.minFloat !== undefined) {
    filtered = filtered.filter(item => item.float_value === null || item.float_value >= filters.minFloat);
  }
  if (filters.maxFloat !== undefined) {
    filtered = filtered.filter(item => item.float_value === null || item.float_value <= filters.maxFloat);
  }

  // Condition filters
  if (filters.conditions && filters.conditions.length > 0) {
    filtered = filtered.filter(item => {
      const exterior = item.exterior?.toLowerCase() || '';
      return filters.conditions.some(cond => {
        switch (cond.toLowerCase()) {
          case 'fn': return exterior.includes('factory new');
          case 'mw': return exterior.includes('minimal wear');
          case 'ft': return exterior.includes('field-tested');
          case 'ww': return exterior.includes('well-worn');
          case 'bs': return exterior.includes('battle-scarred');
          default: return false;
        }
      });
    });
  }

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
