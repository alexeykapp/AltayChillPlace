const { blog } = require('../models/models');

class BlogService {
    async getAllPosts() {
        const posts = await blog.findAll();
        return posts;
    }
    async createNewPost(title, description, date, photo) {
        const newPost = await blog.create({
            publication_title: title,
            publication_date: date,
            publication_text: description,
            image_blog: photo
        });
        return newPost;
    }
}

module.exports = new BlogService();