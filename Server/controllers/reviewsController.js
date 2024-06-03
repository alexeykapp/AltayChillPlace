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
    async createNewReviews(req, res, next) {
        try {
            const { review_text, id_client, id_house, star_rating } = req.body;
            const newReviews = await reviewsService.createNewReviews(review_text, id_client, id_house, star_rating);
            res.json(newReviews);
        }
        catch (err) {
            next(err);
        }
    }

}

module.exports = new ReviewsController();