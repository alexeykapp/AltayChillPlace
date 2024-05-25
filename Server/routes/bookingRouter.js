const express = require('express');
const validateBookingData = require('../middleware/validateBookingData');
const bookingController = require('../controllers/bookingController');

const bookingRouter = express.Router();

bookingRouter.post('/create', validateBookingData, bookingController.createBookingRequest);

module.exports = bookingRouter;