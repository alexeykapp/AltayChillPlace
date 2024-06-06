const ApiError = require('../error/api-error');

const validateHouseData = (req, res, next) => {
    const { houseData, photos } = req.body;

    if (!houseData || !photos || !Array.isArray(photos) || photos.length === 0) {
        return next(new ApiError.BadRequest('Invalid data', 400));
    }

    next();
};

module.exports = validateHouseData;