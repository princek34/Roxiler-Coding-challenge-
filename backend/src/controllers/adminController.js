const { Op, fn, col, literal } = require('sequelize');
const { User, Store, Rating, sequelize } = require('../models');

// @desc    Get Admin Dashboard Stats (total users, stores, ratings)
// @route   GET /api/admin/dashboard
// @access  Private/Admin
const getDashboardStats = async (req, res, next) => {
  try {
    const [totalUsers, totalStores, totalRatings] = await Promise.all([
      User.count(),
      Store.count(),
      Rating.count(),
    ]);

    // Additional breakdown stats
    const totalAdmins = await User.count({ where: { role: 'SYSTEM_ADMIN' } });
    const totalNormalUsers = await User.count({ where: { role: 'NORMAL_USER' } });
    const totalStoreOwners = await User.count({ where: { role: 'STORE_OWNER' } });

    return res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalStores,
        totalRatings,
        breakdown: {
          admins: totalAdmins,
          normalUsers: totalNormalUsers,
          storeOwners: totalStoreOwners,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users with filtering, sorting, and store rating for Store Owners
// @route   GET /api/admin/users
// @access  Private/Admin
const getUsers = async (req, res, next) => {
  try {
    const {
      search,
      name,
      email,
      address,
      role,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
    } = req.query;

    const whereConditions = {};

    // Specific filters
    if (name) {
      whereConditions.name = { [Op.like]: `%${name.trim()}%` };
    }
    if (email) {
      whereConditions.email = { [Op.like]: `%${email.trim()}%` };
    }
    if (address) {
      whereConditions.address = { [Op.like]: `%${address.trim()}%` };
    }
    if (role && ['SYSTEM_ADMIN', 'NORMAL_USER', 'STORE_OWNER'].includes(role)) {
      whereConditions.role = role;
    }

    // General search filter across name, email, address
    if (search) {
      whereConditions[Op.or] = [
        { name: { [Op.like]: `%${search.trim()}%` } },
        { email: { [Op.like]: `%${search.trim()}%` } },
        { address: { [Op.like]: `%${search.trim()}%` } },
      ];
    }

    // Fetch users with their ownedStore and the store's ratings
    const users = await User.findAll({
      where: whereConditions,
      include: [
        {
          model: Store,
          as: 'ownedStore',
          attributes: ['id', 'name', 'email', 'address'],
          include: [
            {
              model: Rating,
              as: 'ratings',
              attributes: ['rating'],
            },
          ],
        },
      ],
      order: [
        ['name', 'email', 'address', 'role', 'createdAt'].includes(sortBy)
          ? [sortBy, sortOrder.toUpperCase() === 'ASC' ? 'ASC' : 'DESC']
          : ['createdAt', 'DESC'],
      ],
    });

    // Format response and calculate store rating for store owners
    const formattedUsers = users.map((user) => {
      let storeRating = null;
      let storeRatingCount = 0;

      if (user.role === 'STORE_OWNER' && user.ownedStore) {
        const ratings = user.ownedStore.ratings || [];
        storeRatingCount = ratings.length;
        if (ratings.length > 0) {
          const sum = ratings.reduce((acc, r) => acc + r.rating, 0);
          storeRating = parseFloat((sum / ratings.length).toFixed(1));
        } else {
          storeRating = 0;
        }
      }

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        address: user.address,
        role: user.role,
        createdAt: user.createdAt,
        storeRating,
        storeRatingCount,
        store: user.ownedStore
          ? {
              id: user.ownedStore.id,
              name: user.ownedStore.name,
              email: user.ownedStore.email,
              address: user.ownedStore.address,
            }
          : null,
      };
    });

    // Handle in-memory sort if sorting by 'storeRating'
    if (sortBy === 'storeRating' || sortBy === 'rating') {
      const orderFactor = sortOrder.toUpperCase() === 'ASC' ? 1 : -1;
      formattedUsers.sort((a, b) => {
        const aVal = a.storeRating !== null ? a.storeRating : -1;
        const bVal = b.storeRating !== null ? b.storeRating : -1;
        return (aVal - bVal) * orderFactor;
      });
    }

    return res.status(200).json({
      success: true,
      count: formattedUsers.length,
      users: formattedUsers,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user details by ID
// @route   GET /api/admin/users/:id
// @access  Private/Admin
const getUserById = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id, {
      include: [
        {
          model: Store,
          as: 'ownedStore',
          include: [
            {
              model: Rating,
              as: 'ratings',
              include: [
                {
                  model: User,
                  as: 'user',
                  attributes: ['id', 'name', 'email'],
                },
              ],
            },
          ],
        },
      ],
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    let storeRating = null;
    let storeRatingCount = 0;

    if (user.role === 'STORE_OWNER' && user.ownedStore) {
      const ratings = user.ownedStore.ratings || [];
      storeRatingCount = ratings.length;
      if (ratings.length > 0) {
        const sum = ratings.reduce((acc, r) => acc + r.rating, 0);
        storeRating = parseFloat((sum / ratings.length).toFixed(1));
      } else {
        storeRating = 0;
      }
    }

    return res.status(200).json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        address: user.address,
        role: user.role,
        createdAt: user.createdAt,
        storeRating,
        storeRatingCount,
        ownedStore: user.ownedStore || null,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin create new user (Admin, Normal User, or Store Owner)
// @route   POST /api/admin/users
// @access  Private/Admin
const createUser = async (req, res, next) => {
  try {
    const { name, email, password, address, role } = req.body;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'A user with this email already exists.',
      });
    }

    const user = await User.create({
      name,
      email,
      password,
      address,
      role: role || 'NORMAL_USER',
    });

    return res.status(201).json({
      success: true,
      message: 'User created successfully.',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        address: user.address,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all stores for admin with filters and sorting
// @route   GET /api/admin/stores
// @access  Private/Admin
const getStores = async (req, res, next) => {
  try {
    const {
      search,
      name,
      email,
      address,
      sortBy = 'name',
      sortOrder = 'ASC',
    } = req.query;

    const whereConditions = {};

    if (name) {
      whereConditions.name = { [Op.like]: `%${name.trim()}%` };
    }
    if (email) {
      whereConditions.email = { [Op.like]: `%${email.trim()}%` };
    }
    if (address) {
      whereConditions.address = { [Op.like]: `%${address.trim()}%` };
    }

    if (search) {
      whereConditions[Op.or] = [
        { name: { [Op.like]: `%${search.trim()}%` } },
        { email: { [Op.like]: `%${search.trim()}%` } },
        { address: { [Op.like]: `%${search.trim()}%` } },
      ];
    }

    const stores = await Store.findAll({
      where: whereConditions,
      include: [
        {
          model: User,
          as: 'owner',
          attributes: ['id', 'name', 'email', 'address'],
        },
        {
          model: Rating,
          as: 'ratings',
          attributes: ['rating'],
        },
      ],
      order: [
        ['name', 'email', 'address', 'createdAt'].includes(sortBy)
          ? [sortBy, sortOrder.toUpperCase() === 'DESC' ? 'DESC' : 'ASC']
          : ['createdAt', 'DESC'],
      ],
    });

    const formattedStores = stores.map((store) => {
      const ratings = store.ratings || [];
      const count = ratings.length;
      let rating = 0;
      if (count > 0) {
        const sum = ratings.reduce((acc, r) => acc + r.rating, 0);
        rating = parseFloat((sum / count).toFixed(1));
      }

      return {
        id: store.id,
        name: store.name,
        email: store.email,
        address: store.address,
        rating,
        totalRatings: count,
        owner: store.owner || null,
        createdAt: store.createdAt,
      };
    });

    if (sortBy === 'rating') {
      const factor = sortOrder.toUpperCase() === 'DESC' ? -1 : 1;
      formattedStores.sort((a, b) => (a.rating - b.rating) * factor);
    }

    return res.status(200).json({
      success: true,
      count: formattedStores.length,
      stores: formattedStores,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin create new store
// @route   POST /api/admin/stores
// @access  Private/Admin
const createStore = async (req, res, next) => {
  try {
    const { name, email, address, ownerId } = req.body;

    const existingStore = await Store.findOne({ where: { email } });
    if (existingStore) {
      return res.status(400).json({
        success: false,
        message: 'A store with this email already exists.',
      });
    }

    if (ownerId) {
      const owner = await User.findByPk(ownerId);
      if (!owner) {
        return res.status(400).json({
          success: false,
          message: 'Specified store owner user does not exist.',
        });
      }
      if (owner.role !== 'STORE_OWNER') {
        return res.status(400).json({
          success: false,
          message: 'Assigned user must have role STORE_OWNER.',
        });
      }

      const existingOwned = await Store.findOne({ where: { ownerId } });
      if (existingOwned) {
        return res.status(400).json({
          success: false,
          message: 'This user is already assigned as owner of another store.',
        });
      }
    }

    const store = await Store.create({
      name,
      email,
      address,
      ownerId: ownerId || null,
    });

    const storeWithOwner = await Store.findByPk(store.id, {
      include: [
        {
          model: User,
          as: 'owner',
          attributes: ['id', 'name', 'email'],
        },
      ],
    });

    return res.status(201).json({
      success: true,
      message: 'Store created successfully.',
      store: {
        id: storeWithOwner.id,
        name: storeWithOwner.name,
        email: storeWithOwner.email,
        address: storeWithOwner.address,
        rating: 0,
        totalRatings: 0,
        owner: storeWithOwner.owner,
        createdAt: storeWithOwner.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get store owners list (for store assignment dropdown)
// @route   GET /api/admin/store-owners
// @access  Private/Admin
const getStoreOwners = async (req, res, next) => {
  try {
    const owners = await User.findAll({
      where: { role: 'STORE_OWNER' },
      include: [
        {
          model: Store,
          as: 'ownedStore',
          attributes: ['id', 'name'],
        },
      ],
      attributes: ['id', 'name', 'email', 'address'],
    });

    return res.status(200).json({
      success: true,
      owners,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardStats,
  getUsers,
  getUserById,
  createUser,
  getStores,
  createStore,
  getStoreOwners,
};
