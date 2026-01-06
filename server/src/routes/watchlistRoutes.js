const express = require('express');
const router = express.Router();
const watchlistController = require('../controllers/watchlistController');

// Middleware to extract user token
const extractUserToken = (req, res, next) => {
  const userToken = req.headers['x-user-token'];
  if (!userToken) {
    return res.status(401).json({ error: 'User token required' });
  }
  req.userToken = userToken;
  next();
};

// Apply middleware to all routes
router.use(extractUserToken);

// GET /api/watchlist - Get user's watchlist
router.get('/', watchlistController.getWatchlist);

// POST /api/watchlist - Add item to watchlist
router.post('/', watchlistController.addToWatchlist);

// DELETE /api/watchlist/:marketplace/:listingId - Remove item from watchlist
router.delete('/:marketplace/:listingId', watchlistController.removeFromWatchlist);

// GET /api/watchlist/check/:marketplace/:listingId - Check if item is in watchlist
router.get('/check/:marketplace/:listingId', watchlistController.checkWatchlist);

// POST /api/watchlist/refresh - Refresh watchlist (remove stale items)
router.post('/refresh', watchlistController.refreshWatchlist);

module.exports = router;
