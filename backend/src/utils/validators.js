const { body, validationResult } = require('express-validator');

// Regex for Password: 8-16 characters, at least one uppercase letter, at least one special character
const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~])[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]{8,16}$/;

const validate = (validations) => {
  return async (req, res, next) => {
    await Promise.all(validations.map((validation) => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    const extractedErrors = errors.array().map((err) => ({
      field: err.path || err.param,
      message: err.msg,
    }));

    return res.status(400).json({
      success: false,
      message: extractedErrors[0].message,
      errors: extractedErrors,
    });
  };
};

const registerValidation = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 60 })
    .withMessage('Name must be between 2 and 60 characters long.'),
  body('email')
    .trim()
    .isEmail()
    .withMessage('Must be a valid email address.')
    .normalizeEmail(),
  body('address')
    .trim()
    .notEmpty()
    .withMessage('Address is required.')
    .isLength({ max: 400 })
    .withMessage('Address must not exceed 400 characters.'),
  body('password')
    .matches(PASSWORD_REGEX)
    .withMessage(
      'Password must be 8-16 characters and include at least one uppercase letter and one special character.'
    ),
];

const loginValidation = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('Must be a valid email address.')
    .normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required.'),
];

const updatePasswordValidation = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required.'),
  body('newPassword')
    .matches(PASSWORD_REGEX)
    .withMessage(
      'New password must be 8-16 characters and include at least one uppercase letter and one special character.'
    ),
];

const createUserValidation = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 60 })
    .withMessage('Name must be between 2 and 60 characters long.'),
  body('email')
    .trim()
    .isEmail()
    .withMessage('Must be a valid email address.')
    .normalizeEmail(),
  body('address')
    .trim()
    .notEmpty()
    .withMessage('Address is required.')
    .isLength({ max: 400 })
    .withMessage('Address must not exceed 400 characters.'),
  body('password')
    .matches(PASSWORD_REGEX)
    .withMessage(
      'Password must be 8-16 characters and include at least one uppercase letter and one special character.'
    ),
  body('role')
    .isIn(['SYSTEM_ADMIN', 'NORMAL_USER', 'STORE_OWNER'])
    .withMessage('Role must be SYSTEM_ADMIN, NORMAL_USER, or STORE_OWNER.'),
];

const createStoreValidation = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 60 })
    .withMessage('Store Name must be between 2 and 60 characters long.'),
  body('email')
    .trim()
    .isEmail()
    .withMessage('Must be a valid store email address.')
    .normalizeEmail(),
  body('address')
    .trim()
    .notEmpty()
    .withMessage('Store address is required.')
    .isLength({ max: 400 })
    .withMessage('Address must not exceed 400 characters.'),
  body('ownerId')
    .optional({ nullable: true, checkFalsy: true })
    .isInt()
    .withMessage('Owner ID must be an integer if provided.'),
];

const ratingValidation = [
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be an integer between 1 and 5.'),
];

module.exports = {
  validate,
  registerValidation,
  loginValidation,
  updatePasswordValidation,
  createUserValidation,
  createStoreValidation,
  ratingValidation,
  PASSWORD_REGEX,
};
