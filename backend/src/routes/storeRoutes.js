const express = require('express');
const router = express.Router();
const storeController = require('../controllers/storeController');
const { authenticate } = require('../middlewares/auth');

// All store browsing routes require authentication
router.get('/', authenticate, storeController.getAllStores);
router.get('/:id', authenticate, storeController.getStoreById);

module.exports = router;
