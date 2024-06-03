const express = require('express');
const reviewsRouter = express.Router();
const reviewsController = require('../controllers/reviewsController');
const authMiddleware = require('../middleware/auth-middleware')

reviewsRouter.get('/all', reviewsController.getAllReviews);
reviewsRouter.post('/createnew', reviewsController.createNewReviews);

module.exports = reviewsRouter;