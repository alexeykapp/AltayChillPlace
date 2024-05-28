const reviewsService = require('../service/reviewsService');

class ReviewsController {
    async getAllReviews(req, res, next) {
        try {
            const reviews = await reviewsService.getAllReviews();
            return res.json(reviews);
        }
        catch (err) {
            next(err);
        }
    }
}

module.exports = new ReviewsController();