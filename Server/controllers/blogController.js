const { blog } = require('../models/models');
const blogService = require('../service/blogService');

class BlogController {
    async getAllPosts(req, res, next) {
        try {
            const posts = await blogService.getAllPosts();
            if (posts.length == 0) {
                return res.json({ message: 'There are no blog entries' })
            }
            return res.json(posts);
        }
        catch (err) {
            next(err);
        }
    }
}

module.exports = new BlogController();