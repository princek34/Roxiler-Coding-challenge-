const express = require('express');
const router = express.Router();
const ratingController = require('../controllers/ratingController');
const { authenticate, authorize } = require('../middlewares/auth');
const { validate, ratingValidation } = require('../utils/validators');

// Normal users submit or modify rating
router.post(
  '/',
  authenticate,
  authorize('NORMAL_USER', 'SYSTEM_ADMIN'),
  validate(ratingValidation),
  ratingController.submitOrUpdateRating
);

router.put(
  '/:id',
  authenticate,
  authorize('NORMAL_USER', 'SYSTEM_ADMIN'),
  validate(ratingValidation),
  ratingController.modifyRating
);

// Store Owner dashboard data
router.get(
  '/owner-dashboard',
  authenticate,
  authorize('STORE_OWNER', 'SYSTEM_ADMIN'),
  ratingController.getStoreOwnerDashboard
);

module.exports = router;
