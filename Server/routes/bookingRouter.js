const express = require('express');
const validateBookingData = require('../middleware/validateBookingData');
const bookingController = require('../controllers/bookingController');

const bookingRouter = express.Router();

bookingRouter.post('/create', validateBookingData, bookingController.createBookingRequest);
bookingRouter.get('/history/:id', bookingController.getHistoryBooking)

module.exports = bookingRouter;