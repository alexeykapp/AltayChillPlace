const { cast } = require('sequelize');
const blogService = require('../service/blogService');

class AdminController {
    async createNewPostBlog(req, res, next) {
        try {
            const { title, description, date, photo } = req.body;
            const newPost = await blogService.createNewPost(title, description, date, photo);
            return res.json(newPost);
        }
        catch (err) {
            next();
        }
    }
}

module.exports = new AdminController();