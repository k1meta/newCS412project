const axios = require('axios');

const CSFLOAT_API_BASE = 'https://csfloat.com/api/v1';
const API_KEY = process.env.CSFLOAT_API_KEY;

// All possible exterior conditions
const EXTERIORS = [
  'Factory New',
  'Minimal Wear', 
  'Field-Tested',
  'Well-Worn',
  'Battle-Scarred'
];

// Create axios instance for CSFloat
const csfloatApi = axios.create({
  baseURL: CSFLOAT_API_BASE,
  headers: {
    'Authorization': API_KEY || ''
  }
});

// Get listings from CSFloat
const getListings = async (filters = {}) => {
  try {
    // If no search term, return empty (don't fetch all items)
    if (!filters.search) {
      return [];
    }

    // CSFloat requires exact market_hash_name with exterior
    // We need to search for all exterior variations
    const baseItemName = filters.search.trim();
    
    // Check if search already includes an exterior
    const hasExterior = EXTERIORS.some(ext => 
      baseItemName.toLowerCase().includes(ext.toLowerCase())
    );

    let allItems = [];

    if (hasExterior) {
      // Search with exact name provided
      const items = await fetchListings(baseItemName, filters);
      allItems = items;
    } else {
      // Search all 5 exterior variations in parallel
      const searchPromises = EXTERIORS.map(exterior => 
        fetchListings(`${baseItemName} (${exterior})`, filters)
      );
      
      const results = await Promise.all(searchPromises);
      allItems = results.flat();
    }
    
    return applyLocalFilters(allItems, filters);
  } catch (err) {
    console.error('CSFloat API error:', err.message);
    return [];
  }
};

// Fetch listings for a specific market_hash_name
const fetchListings = async (marketHashName, filters) => {
  try {
    const params = {
      market_hash_name: marketHashName,
      limit: 50
    };

    if (filters.minPrice) {
      params.min_price = filters.minPrice;
    }
    if (filters.maxPrice) {
      params.max_price = filters.maxPrice;
    }
    if (filters.minFloat !== undefined) {
      params.min_float = filters.minFloat;
    }
    if (filters.maxFloat !== undefined) {
      params.max_float = filters.maxFloat;
    }

    const response = await csfloatApi.get('/listings', { params });
    return (response.data.data || response.data || []).map(normalizeItem);
  } catch (err) {
    // Silently fail for individual searches (item might not exist in that condition)
    return [];
  }
};

// Check if a specific listing exists
const checkListingExists = async (listingId) => {
  try {
    const response = await csfloatApi.get(`/listings/${listingId}`);
    return response.status === 200;
  } catch (err) {
    return false;
  }
};

// Normalize CSFloat item to common format
const normalizeItem = (item) => {
  const listing = item.listing || item;
  const itemData = item.item || listing.item || {};

  return {
    marketplace: 'csfloat',
    listing_id: listing.id || item.id,
    market_hash_name: itemData.market_hash_name || listing.market_hash_name,
    item_name: itemData.item_name || extractItemName(itemData.market_hash_name),
    price_cents: listing.price || item.price,
    float_value: itemData.float_value || listing.float_value,
    exterior: getExteriorFromFloat(itemData.float_value),
    is_stattrak: itemData.is_stattrak || false,
    is_souvenir: itemData.is_souvenir || false,
    rarity: itemData.rarity_name || itemData.rarity || 'unknown',
    icon_url: itemData.icon_url || getIconUrl(itemData.market_hash_name),
    listing_url: `https://csfloat.com/item/${listing.id || item.id}`,
    stickers: itemData.stickers || [],
    paint_seed: itemData.paint_seed,
    paint_index: itemData.paint_index
  };
};

// Extract item name from market hash name
const extractItemName = (marketHashName) => {
  if (!marketHashName) return '';
  // Remove condition part: "AK-47 | Redline (Field-Tested)" -> "AK-47 | Redline"
  return marketHashName.replace(/\s*\([^)]+\)\s*$/, '');
};

// Get exterior/condition from float value
const getExteriorFromFloat = (floatValue) => {
  if (floatValue === undefined || floatValue === null) return 'Unknown';
  if (floatValue < 0.07) return 'Factory New';
  if (floatValue < 0.15) return 'Minimal Wear';
  if (floatValue < 0.38) return 'Field-Tested';
  if (floatValue < 0.45) return 'Well-Worn';
  return 'Battle-Scarred';
};

// Get icon URL from Steam CDN
const getIconUrl = (marketHashName) => {
  if (!marketHashName) return '';
  const encoded = encodeURIComponent(marketHashName);
  return `https://steamcommunity-a.akamaihd.net/economy/image/class/730/${encoded}/200fx200f`;
};

// Apply local filters that API doesn't support
const applyLocalFilters = (items, filters) => {
  let filtered = [...items];

  // Filter by conditions
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

  // Filter by type (stattrak, souvenir, normal)
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
