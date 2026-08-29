const errorHandler = (err, req, res, next) => {
  console.error('API Error Handler Caught:', err);

  // 1. Sequelize Unique Constraint Error (e.g. duplicate email)
  if (err.name === 'SequelizeUniqueConstraintError' || err.code === 'ER_DUP_ENTRY') {
    const field = (err.errors && err.errors[0]?.path) ? err.errors[0].path : 'Field';
    return res.status(400).json({
      success: false,
      message: `An account or record with this ${field} already exists.`,
      errors: err.errors ? err.errors.map((e) => ({ field: e.path, message: e.message })) : [],
    });
  }

  // 2. Sequelize Validation Error
  if (err.name === 'SequelizeValidationError') {
    const msg = (err.errors && err.errors[0]?.message) ? err.errors[0].message : 'Validation failed.';
    return res.status(400).json({
      success: false,
      message: msg,
      errors: err.errors ? err.errors.map((e) => ({ field: e.path, message: e.message })) : [],
    });
  }

  // 3. Sequelize Foreign Key Constraint Error
  if (err.name === 'SequelizeForeignKeyConstraintError') {
    return res.status(400).json({
      success: false,
      message: 'Referenced entity does not exist.',
    });
  }

  // 4. Database Connection Errors
  if (
    err.name === 'SequelizeConnectionError' ||
    err.name === 'SequelizeConnectionRefusedError' ||
    err.name === 'SequelizeHostNotFoundError' ||
    err.name === 'SequelizeAccessDeniedError'
  ) {
    return res.status(503).json({
      success: false,
      message: 'Database connection failed. Please ensure MySQL service is running and credentials in .env are correct.',
    });
  }

  // 5. Default Fallback
  const statusCode = err.statusCode || 500;
  return res.status(statusCode).json({
    success: false,
    message: err.message || 'An unexpected error occurred. Please try again.',
  });
};

module.exports = errorHandler;
