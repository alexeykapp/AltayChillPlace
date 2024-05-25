const express = require('express');
const blogRouter = express.Router();
const blogController = require('../controllers/blogController');

blogRouter.get('/posts', blogController.getAllPosts);

module.exports = blogRouter;