const csfloatService = require('./csfloatService');
const skinportService = require('./skinportService');
const bitskinsService = require('./bitskinsService');

// Search all marketplaces and aggregate results
const searchAllMarketplaces = async (filters = {}, forceRefresh = false) => {
  console.log('Aggregator: Starting search with filters:', JSON.stringify(filters));
  
  try {
    // Fetch from all marketplaces in parallel
    console.log('Aggregator: Fetching from all marketplaces...');
    
    const [csfloatItems, skinportItems, bitskinsItems] = await Promise.all([
      csfloatService.getListings(filters).catch(err => {
        console.error('CSFloat fetch error:', err.message);
        return [];
      }),
      skinportService.getListings(filters).catch(err => {
        console.error('Skinport fetch error:', err.message);
        return [];
      }),
      bitskinsService.getListings(filters).catch(err => {
        console.error('Bitskins fetch error:', err.message);
        return [];
      })
    ]);

    console.log(`Aggregator: CSFloat=${csfloatItems.length}, Skinport=${skinportItems.length}, Bitskins=${bitskinsItems.length}`);

    // Combine all items
    const allItems = [
      ...csfloatItems,
      ...skinportItems,
      ...bitskinsItems
    ];

    console.log(`Aggregator: Total items = ${allItems.length}`);
    return allItems;
  } catch (err) {
    console.error('Aggregator error:', err.message);
    return [];
  }
};

// Check if a listing exists on its marketplace
const checkListingExists = async (marketplace, listingId) => {
  try {
    switch (marketplace.toLowerCase()) {
      case 'csfloat':
        return await csfloatService.checkListingExists(listingId);
      case 'skinport':
        return await skinportService.checkListingExists(listingId);
      case 'bitskins':
        return await bitskinsService.checkListingExists(listingId);
      default:
        console.warn(`Unknown marketplace: ${marketplace}`);
        return false;
    }
  } catch (err) {
    console.error(`Error checking listing ${listingId} on ${marketplace}:`, err.message);
    return false;
  }
};

// Get marketplace statistics
const getMarketplaceStats = async () => {
  try {
    const [csfloatItems, skinportItems, bitskinsItems] = await Promise.all([
      csfloatService.getListings({}).catch(() => []),
      skinportService.getListings({}).catch(() => []),
      bitskinsService.getListings({}).catch(() => [])
    ]);

    return {
      csfloat: {
        count: csfloatItems.length,
        available: csfloatItems.length > 0
      },
      skinport: {
        count: skinportItems.length,
        available: skinportItems.length > 0
      },
      bitskins: {
        count: bitskinsItems.length,
        available: bitskinsItems.length > 0
      },
      total: csfloatItems.length + skinportItems.length + bitskinsItems.length
    };
  } catch (err) {
    console.error('Stats error:', err.message);
    return {
      csfloat: { count: 0, available: false },
      skinport: { count: 0, available: false },
      bitskins: { count: 0, available: false },
      total: 0
    };
  }
};

module.exports = {
  searchAllMarketplaces,
  checkListingExists,
  getMarketplaceStats
};
