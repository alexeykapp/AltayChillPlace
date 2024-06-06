const { body, validationResult } = require('express-validator');
const ApiError = require('../error/api-error');

const validateBookingData = [
    body('booking.id_client').notEmpty().withMessage('Client ID is required'),
    body('booking.id_house').notEmpty().withMessage('House ID is required'),
    body('booking.numberOfPeople')
        .notEmpty().withMessage('Number of people is required')
        .isNumeric().withMessage('Number of people must be a number'),
    body('booking.arrivalDate')
        .notEmpty().withMessage('Arrival Date is required')
        .isISO8601().withMessage('Arrival Date must be a valid date in the format YYYY-MM-DD'),
    body('booking.departureDate')
        .notEmpty().withMessage('Departure Date is required')
        .isISO8601().withMessage('Departure Date must be a valid date'),
    body('services')
        .optional()
        .isArray().withMessage('If provided, services must be an array')
        .custom((services) => {
            return Array.isArray(services) && services.every(Number.isInteger);
        }).withMessage('Services array should contain only numbers'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return next(ApiError.ValidationError('Validation error', errors.array()));
        }
        next();
    }
];

module.exports = validateBookingData;