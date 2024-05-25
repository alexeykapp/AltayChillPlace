const { body, validationResult } = require('express-validator');
const ApiError = require('../error/api-error');

const validateBookingData = [
    body('booking.id_client').notEmpty().withMessage('Client ID is required'),
    body('booking.id_house').notEmpty().withMessage('House ID is required'),
    body('booking.numberOfPeople').notEmpty().isNumeric().withMessage('Number of people is required and must be a number'),
    body('booking.arrivalDate').notEmpty().isISO8601().withMessage('Arrival Date is required and must be a valid date in the format YYYY-MM-DD'),
    body('booking.departureDate').notEmpty().isISO8601().withMessage('Departure Date is required and must be a valid date'),
    body('services').notEmpty().isArray().withMessage('Services must be an array and should not be empty')
        .custom((services) => {
            return services.every(Number.isInteger);
        }).withMessage('Services array should contain only numbers'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return next(new ApiError.BadRequest('ValidationError', errors.array()));
        }
        next();
    }
];

module.exports = validateBookingData;