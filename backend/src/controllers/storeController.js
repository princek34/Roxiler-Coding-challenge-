const { Op } = require('sequelize');
const { Store, Rating, User } = require('../models');

// @desc    Get all stores for Normal User (with overall rating & user's submitted rating)
// @route   GET /api/stores
// @access  Private (Authenticated users, mainly Normal Users)
const getAllStores = async (req, res, next) => {
  try {
    const { search, name, address, sortBy = 'name', sortOrder = 'ASC' } = req.query;
    const userId = req.user ? req.user.id : null;

    const whereConditions = {};

    if (name) {
      whereConditions.name = { [Op.like]: `%${name.trim()}%` };
    }
    if (address) {
      whereConditions.address = { [Op.like]: `%${address.trim()}%` };
    }

    if (search) {
      whereConditions[Op.or] = [
        { name: { [Op.like]: `%${search.trim()}%` } },
        { address: { [Op.like]: `%${search.trim()}%` } },
      ];
    }

    const stores = await Store.findAll({
      where: whereConditions,
      include: [
        {
          model: Rating,
          as: 'ratings',
          attributes: ['id', 'userId', 'rating', 'createdAt', 'updatedAt'],
        },
      ],
      order: [
        ['name', 'address', 'createdAt'].includes(sortBy)
          ? [sortBy, sortOrder.toUpperCase() === 'DESC' ? 'DESC' : 'ASC']
          : ['name', 'ASC'],
      ],
    });

    const formattedStores = stores.map((store) => {
      const allRatings = store.ratings || [];
      const totalRatings = allRatings.length;
      let overallRating = 0;

      if (totalRatings > 0) {
        const sum = allRatings.reduce((acc, r) => acc + r.rating, 0);
        overallRating = parseFloat((sum / totalRatings).toFixed(1));
      }

      // Find current user's rating for this store
      let myRating = null;
      let myRatingId = null;
      let myRatingUpdatedAt = null;

      if (userId) {
        const userRatingObj = allRatings.find((r) => r.userId === userId);
        if (userRatingObj) {
          myRating = userRatingObj.rating;
          myRatingId = userRatingObj.id;
          myRatingUpdatedAt = userRatingObj.updatedAt;
        }
      }

      return {
        id: store.id,
        name: store.name,
        email: store.email,
        address: store.address,
        overallRating,
        totalRatings,
        myRating,
        myRatingId,
        myRatingUpdatedAt,
      };
    });

    // Custom in-memory sort if sorting by ratings
    if (sortBy === 'overallRating' || sortBy === 'rating') {
      const factor = sortOrder.toUpperCase() === 'DESC' ? -1 : 1;
      formattedStores.sort((a, b) => (a.overallRating - b.overallRating) * factor);
    } else if (sortBy === 'myRating') {
      const factor = sortOrder.toUpperCase() === 'DESC' ? -1 : 1;
      formattedStores.sort((a, b) => {
        const aVal = a.myRating !== null ? a.myRating : -1;
        const bVal = b.myRating !== null ? b.myRating : -1;
        return (aVal - bVal) * factor;
      });
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

// @desc    Get store details by ID
// @route   GET /api/stores/:id
// @access  Private
const getStoreById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user ? req.user.id : null;

    const store = await Store.findByPk(id, {
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
    });

    if (!store) {
      return res.status(404).json({
        success: false,
        message: 'Store not found.',
      });
    }

    const allRatings = store.ratings || [];
    const totalRatings = allRatings.length;
    let overallRating = 0;

    if (totalRatings > 0) {
      const sum = allRatings.reduce((acc, r) => acc + r.rating, 0);
      overallRating = parseFloat((sum / totalRatings).toFixed(1));
    }

    let myRating = null;
    let myRatingId = null;

    if (userId) {
      const userRatingObj = allRatings.find((r) => r.userId === userId);
      if (userRatingObj) {
        myRating = userRatingObj.rating;
        myRatingId = userRatingObj.id;
      }
    }

    return res.status(200).json({
      success: true,
      store: {
        id: store.id,
        name: store.name,
        email: store.email,
        address: store.address,
        overallRating,
        totalRatings,
        myRating,
        myRatingId,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllStores,
  getStoreById,
};
