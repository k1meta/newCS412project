const aggregatorService = require('../services/aggregatorService');
const csfloatService = require('../services/csfloatService');
const skinportService = require('../services/skinportService');
const bitskinsService = require('../services/bitskinsService');

// Search items across all marketplaces
const searchItems = async (req, res, next) => {
  try {
    const {
      search,
      min_price,
      max_price,
      min_float,
      max_float,
      conditions,
      type,
      marketplace,
      sort
    } = req.query;

    const filters = {
      search,
      minPrice: min_price ? parseInt(min_price) : undefined,
      maxPrice: max_price ? parseInt(max_price) : undefined,
      minFloat: min_float ? parseFloat(min_float) : undefined,
      maxFloat: max_float ? parseFloat(max_float) : undefined,
      conditions: conditions ? conditions.split(',') : undefined,
      type, // stattrak, souvenir, normal
      marketplace,
      sort: sort || 'price_asc'
    };

    let items;
    
    if (marketplace && marketplace !== 'all') {
      // Fetch from specific marketplace
      items = await getMarketplaceItems(marketplace, filters);
    } else {
      // Fetch from all marketplaces
      items = await aggregatorService.searchAllMarketplaces(filters);
    }

    // Sort items
    items = sortItems(items, filters.sort);

    res.json({
      success: true,
      count: items.length,
      items
    });
  } catch (err) {
    next(err);
  }
};

// Refresh items (fetch fresh data)
const refreshItems = async (req, res, next) => {
  try {
    const filters = {
      search: req.query.search,
      minPrice: req.query.min_price ? parseInt(req.query.min_price) : undefined,
      maxPrice: req.query.max_price ? parseInt(req.query.max_price) : undefined,
      minFloat: req.query.min_float ? parseFloat(req.query.min_float) : undefined,
      maxFloat: req.query.max_float ? parseFloat(req.query.max_float) : undefined,
      conditions: req.query.conditions ? req.query.conditions.split(',') : undefined,
      type: req.query.type,
      marketplace: req.query.marketplace,
      sort: req.query.sort || 'price_asc'
    };

    // Force refresh from APIs
    let items;
    if (filters.marketplace && filters.marketplace !== 'all') {
      items = await getMarketplaceItems(filters.marketplace, filters, true);
    } else {
      items = await aggregatorService.searchAllMarketplaces(filters, true);
    }

    items = sortItems(items, filters.sort);

    res.json({
      success: true,
      count: items.length,
      items,
      refreshed: true
    });
  } catch (err) {
    next(err);
  }
};

// Get items from specific marketplace
const getByMarketplace = async (req, res, next) => {
  try {
    const { marketplace } = req.params;
    const filters = {
      search: req.query.search,
      minPrice: req.query.min_price ? parseInt(req.query.min_price) : undefined,
      maxPrice: req.query.max_price ? parseInt(req.query.max_price) : undefined,
      minFloat: req.query.min_float ? parseFloat(req.query.min_float) : undefined,
      maxFloat: req.query.max_float ? parseFloat(req.query.max_float) : undefined,
      conditions: req.query.conditions ? req.query.conditions.split(',') : undefined,
      type: req.query.type,
      sort: req.query.sort || 'price_asc'
    };

    const items = await getMarketplaceItems(marketplace, filters);
    const sortedItems = sortItems(items, filters.sort);

    res.json({
      success: true,
      marketplace,
      count: sortedItems.length,
      items: sortedItems
    });
  } catch (err) {
    next(err);
  }
};

// Helper to get items from a specific marketplace
const getMarketplaceItems = async (marketplace, filters, forceRefresh = false) => {
  switch (marketplace.toLowerCase()) {
    case 'csfloat':
      return await csfloatService.getListings(filters);
    case 'skinport':
      return await skinportService.getListings(filters);
    case 'bitskins':
      return await bitskinsService.getListings(filters);
    default:
      throw new Error(`Unknown marketplace: ${marketplace}`);
  }
};

// Sort items based on sort option
const sortItems = (items, sortOption) => {
  const sortedItems = [...items];
  
  switch (sortOption) {
    case 'price_asc':
      return sortedItems.sort((a, b) => (a.price_cents || 0) - (b.price_cents || 0));
    case 'price_desc':
      return sortedItems.sort((a, b) => (b.price_cents || 0) - (a.price_cents || 0));
    case 'float_asc':
      return sortedItems.sort((a, b) => (a.float_value || 0) - (b.float_value || 0));
    case 'float_desc':
      return sortedItems.sort((a, b) => (b.float_value || 0) - (a.float_value || 0));
    default:
      return sortedItems;
  }
};

module.exports = {
  searchItems,
  refreshItems,
  getByMarketplace
};
