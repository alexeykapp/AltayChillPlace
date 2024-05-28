const express = require('express');
const reviewsRouter = express.Router();
const reviewsController = require('../controllers/reviewsController');

reviewsRouter.get('/all', reviewsController.getAllReviews);

module.exports = reviewsRouter;