const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME || 'store_rating_db',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || 'Prince@123',
  {
    host: process.env.DB_HOST || '127.0.0.1',
    port: parseInt(process.env.DB_PORT || '3306', 10),
    dialect: process.env.DB_DIALECT || 'mysql',
    logging: process.env.NODE_ENV === 'development' ? false : false,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);

const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected successfully to MySQL.');
  } catch (error) {
    console.error('❌ Unable to connect to MySQL database:', error.message);
  }
};

module.exports = {
  sequelize,
  testConnection,
};
