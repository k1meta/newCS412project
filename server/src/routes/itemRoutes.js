const express = require('express');
const router = express.Router();
const itemsController = require('../controllers/itemsController');

// GET /api/items - Search items across all marketplaces
router.get('/', itemsController.searchItems);

// GET /api/items/refresh - Refresh items from all marketplaces
router.get('/refresh', itemsController.refreshItems);

// GET /api/items/:marketplace - Get items from specific marketplace
router.get('/:marketplace', itemsController.getByMarketplace);

module.exports = router;
