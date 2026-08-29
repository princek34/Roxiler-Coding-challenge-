const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticate } = require('../middlewares/auth');
const {
  validate,
  registerValidation,
  loginValidation,
  updatePasswordValidation,
} = require('../utils/validators');

// Public routes
router.post('/signup', validate(registerValidation), authController.signup);
router.post('/login', validate(loginValidation), authController.login);

// Authenticated routes
router.get('/me', authenticate, authController.getMe);
router.put(
  '/change-password',
  authenticate,
  validate(updatePasswordValidation),
  authController.updatePassword
);

module.exports = router;
