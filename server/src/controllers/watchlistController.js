const db = require('../config/database');
const aggregatorService = require('../services/aggregatorService');

// Get user's watchlist
const getWatchlist = async (req, res, next) => {
  try {
    const { userToken } = req;

    const result = await db.query(
      `SELECT * FROM watchlist 
       WHERE user_token = $1 
       ORDER BY created_at DESC`,
      [userToken]
    );

    res.json({
      success: true,
      count: result.rows.length,
      items: result.rows
    });
  } catch (err) {
    next(err);
  }
};

// Add item to watchlist
const addToWatchlist = async (req, res, next) => {
  try {
    const { userToken } = req;
    const {
      marketplace,
      listing_id,
      market_hash_name,
      item_name,
      price_cents,
      float_value,
      exterior,
      is_stattrak,
      is_souvenir,
      icon_url,
      listing_url,
      rarity
    } = req.body;

    // Validate required fields
    if (!marketplace || !listing_id || !market_hash_name) {
      return res.status(400).json({
        error: 'Missing required fields: marketplace, listing_id, market_hash_name'
      });
    }

    const result = await db.query(
      `INSERT INTO watchlist (
        user_token, marketplace, listing_id, market_hash_name, item_name,
        price_cents, float_value, exterior, is_stattrak, is_souvenir,
        icon_url, listing_url, rarity
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      ON CONFLICT (user_token, marketplace, listing_id) DO NOTHING
      RETURNING *`,
      [
        userToken, marketplace, listing_id, market_hash_name, item_name,
        price_cents, float_value, exterior, is_stattrak || false, is_souvenir || false,
        icon_url, listing_url, rarity
      ]
    );

    if (result.rows.length === 0) {
      return res.status(409).json({
        error: 'Item already in watchlist'
      });
    }

    res.status(201).json({
      success: true,
      item: result.rows[0]
    });
  } catch (err) {
    next(err);
  }
};

// Remove item from watchlist
const removeFromWatchlist = async (req, res, next) => {
  try {
    const { userToken } = req;
    const { marketplace, listingId } = req.params;

    const result = await db.query(
      `DELETE FROM watchlist 
       WHERE user_token = $1 AND marketplace = $2 AND listing_id = $3
       RETURNING *`,
      [userToken, marketplace, listingId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Item not found in watchlist'
      });
    }

    res.json({
      success: true,
      removed: result.rows[0]
    });
  } catch (err) {
    next(err);
  }
};

// Check if item is in watchlist
const checkWatchlist = async (req, res, next) => {
  try {
    const { userToken } = req;
    const { marketplace, listingId } = req.params;

    const result = await db.query(
      `SELECT id FROM watchlist 
       WHERE user_token = $1 AND marketplace = $2 AND listing_id = $3`,
      [userToken, marketplace, listingId]
    );

    res.json({
      success: true,
      inWatchlist: result.rows.length > 0
    });
  } catch (err) {
    next(err);
  }
};

// Refresh watchlist - remove stale items that are no longer available
const refreshWatchlist = async (req, res, next) => {
  try {
    const { userToken } = req;

    // Get all watchlist items
    const watchlistResult = await db.query(
      `SELECT * FROM watchlist WHERE user_token = $1`,
      [userToken]
    );

    const watchlistItems = watchlistResult.rows;
    const staleItems = [];

    // Check each item against marketplace APIs
    for (const item of watchlistItems) {
      const isAvailable = await aggregatorService.checkListingExists(
        item.marketplace,
        item.listing_id
      );

      if (!isAvailable) {
        staleItems.push(item);
      }
    }

    // Remove stale items
    if (staleItems.length > 0) {
      const staleIds = staleItems.map(item => item.id);
      await db.query(
        `DELETE FROM watchlist WHERE id = ANY($1)`,
        [staleIds]
      );
    }

    // Get updated watchlist
    const updatedResult = await db.query(
      `SELECT * FROM watchlist 
       WHERE user_token = $1 
       ORDER BY created_at DESC`,
      [userToken]
    );

    res.json({
      success: true,
      count: updatedResult.rows.length,
      items: updatedResult.rows,
      removed: staleItems.length,
      removedItems: staleItems.map(item => ({
        market_hash_name: item.market_hash_name,
        marketplace: item.marketplace
      }))
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getWatchlist,
  addToWatchlist,
  removeFromWatchlist,
  checkWatchlist,
  refreshWatchlist
};
