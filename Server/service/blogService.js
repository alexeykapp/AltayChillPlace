const { blog } = require('../models/models');

class BlogService {
    async getAllPosts() {
        const posts = await blog.findAll();
        return posts;
    }
}

module.exports = new BlogService();