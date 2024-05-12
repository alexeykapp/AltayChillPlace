const express = require('express');
const bookingController = require('../controllers/bookingController');

const bookingRouter = express.Router();

bookingRouter.post('/create', bookingController.createBookingRequest);

module.exports = bookingRouter;