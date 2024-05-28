module.exports = class ReviewsDto {
    name;
    description;
    star_rating;
    photos;
    constructor(client, reviews, photos) {
        this.name = client.first_name;
        this.description = reviews.review_text;
        this.star_rating = reviews.star_rating;
        this.photos = photos.map(photo => photo.photo_review.toJSON().data);
    }
}