const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticate, authorize } = require('../middlewares/auth');
const {
  validate,
  createUserValidation,
  createStoreValidation,
} = require('../utils/validators');

// All admin routes require authentication and role SYSTEM_ADMIN
router.use(authenticate, authorize('SYSTEM_ADMIN'));

// Dashboard stats
router.get('/dashboard', adminController.getDashboardStats);

// User management
router.get('/users', adminController.getUsers);
router.get('/users/:id', adminController.getUserById);
router.post('/users', validate(createUserValidation), adminController.createUser);

// Store management
router.get('/stores', adminController.getStores);
router.post('/stores', validate(createStoreValidation), adminController.createStore);
router.get('/store-owners', adminController.getStoreOwners);

module.exports = router;
