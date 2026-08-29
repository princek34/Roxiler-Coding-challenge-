const { Rating, Store, User } = require('../models');

// @desc    Submit a new rating or update existing rating for a store
// @route   POST /api/ratings
// @access  Private (NORMAL_USER)
const submitOrUpdateRating = async (req, res, next) => {
  try {
    const { storeId, rating } = req.body;
    const userId = req.user.id;

    if (!storeId || !rating) {
      return res.status(400).json({
        success: false,
        message: 'Store ID and rating (1-5) are required.',
      });
    }

    const numericRating = parseInt(rating, 10);
    if (isNaN(numericRating) || numericRating < 1 || numericRating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be an integer between 1 and 5.',
      });
    }

    const store = await Store.findByPk(storeId);
    if (!store) {
      return res.status(404).json({
        success: false,
        message: 'Store not found.',
      });
    }

    // Check if user already submitted a rating
    let userRating = await Rating.findOne({
      where: { userId, storeId },
    });

    let isModified = false;
    if (userRating) {
      userRating.rating = numericRating;
      await userRating.save();
      isModified = true;
    } else {
      userRating = await Rating.create({
        userId,
        storeId,
        rating: numericRating,
      });
    }

    // Fetch updated store stats
    const allRatings = await Rating.findAll({ where: { storeId } });
    const totalRatings = allRatings.length;
    const sum = allRatings.reduce((acc, r) => acc + r.rating, 0);
    const overallRating = parseFloat((sum / totalRatings).toFixed(1));

    return res.status(200).json({
      success: true,
      message: isModified
        ? 'Your rating has been updated successfully.'
        : 'Your rating has been submitted successfully.',
      rating: {
        id: userRating.id,
        storeId: userRating.storeId,
        rating: userRating.rating,
        updatedAt: userRating.updatedAt,
      },
      storeStats: {
        overallRating,
        totalRatings,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Modify existing rating
// @route   PUT /api/ratings/:id
// @access  Private (NORMAL_USER)
const modifyRating = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rating } = req.body;
    const userId = req.user.id;

    const numericRating = parseInt(rating, 10);
    if (isNaN(numericRating) || numericRating < 1 || numericRating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be an integer between 1 and 5.',
      });
    }

    const userRating = await Rating.findByPk(id);
    if (!userRating) {
      return res.status(404).json({
        success: false,
        message: 'Rating record not found.',
      });
    }

    // Ensure the user owns this rating
    if (userRating.userId !== userId && req.user.role !== 'SYSTEM_ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'You can only modify your own ratings.',
      });
    }

    userRating.rating = numericRating;
    await userRating.save();

    // Fetch updated store stats
    const allRatings = await Rating.findAll({ where: { storeId: userRating.storeId } });
    const totalRatings = allRatings.length;
    const sum = allRatings.reduce((acc, r) => acc + r.rating, 0);
    const overallRating = parseFloat((sum / totalRatings).toFixed(1));

    return res.status(200).json({
      success: true,
      message: 'Rating modified successfully.',
      rating: userRating,
      storeStats: {
        overallRating,
        totalRatings,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get ratings for Store Owner's dashboard
// @route   GET /api/ratings/owner-dashboard
// @access  Private (STORE_OWNER)
const getStoreOwnerDashboard = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { sortBy = 'createdAt', sortOrder = 'DESC' } = req.query;

    const store = await Store.findOne({
      where: { ownerId: userId },
      include: [
        {
          model: Rating,
          as: 'ratings',
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['id', 'name', 'email', 'address'],
            },
          ],
        },
      ],
    });

    if (!store) {
      return res.status(200).json({
        success: true,
        hasStore: false,
        message: 'No store is currently assigned to your account.',
        store: null,
        stats: {
          averageRating: 0,
          totalRatings: 0,
        },
        ratings: [],
      });
    }

    const ratingsList = store.ratings || [];
    const totalRatings = ratingsList.length;
    let averageRating = 0;

    if (totalRatings > 0) {
      const sum = ratingsList.reduce((acc, r) => acc + r.rating, 0);
      averageRating = parseFloat((sum / totalRatings).toFixed(1));
    }

    // Format list of ratings with user details
    let formattedRatings = ratingsList.map((r) => ({
      id: r.id,
      rating: r.rating,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
      user: r.user
        ? {
            id: r.user.id,
            name: r.user.name,
            email: r.user.email,
            address: r.user.address,
          }
        : {
            id: null,
            name: 'Unknown User',
            email: 'N/A',
            address: 'N/A',
          },
    }));

    // Sorting
    const factor = sortOrder.toUpperCase() === 'ASC' ? 1 : -1;
    if (sortBy === 'name' || sortBy === 'userName') {
      formattedRatings.sort((a, b) => a.user.name.localeCompare(b.user.name) * factor);
    } else if (sortBy === 'email' || sortBy === 'userEmail') {
      formattedRatings.sort((a, b) => a.user.email.localeCompare(b.user.email) * factor);
    } else if (sortBy === 'rating') {
      formattedRatings.sort((a, b) => (a.rating - b.rating) * factor);
    } else {
      // Default: date (createdAt or updatedAt)
      formattedRatings.sort((a, b) => (new Date(a.createdAt) - new Date(b.createdAt)) * factor);
    }

    return res.status(200).json({
      success: true,
      hasStore: true,
      store: {
        id: store.id,
        name: store.name,
        email: store.email,
        address: store.address,
      },
      stats: {
        averageRating,
        totalRatings,
      },
      ratings: formattedRatings,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  submitOrUpdateRating,
  modifyRating,
  getStoreOwnerDashboard,
};
