const { review_to_number, client, photos_in_review } = require('../models/models')
const ReviewsDto = require('../dtos/reviewsDto');

class ReviewsService {
    async getAllReviews() {
        let reviewDtos = [];
        const reviews = await review_to_number.findAll();
        for (let review of reviews) {
            const user = await client.findByPk(review.fk_client);
            const photos = await this.findAllPhotos(review.id_review_to_number);
            const reviewDto = new ReviewsDto(user, review, photos);
            reviewDtos.push(reviewDto);
        }
        return reviewDtos;
    }
    async findAllPhotos(idReview) {
        const photos = await photos_in_review.findAll({
            where: {
                fk_review: idReview
            }
        });
        console.log(photos);
        return photos;
    }
}

module.exports = new ReviewsService();