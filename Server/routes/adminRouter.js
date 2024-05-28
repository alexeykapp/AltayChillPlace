const express = require('express');
const adminRouter = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/auth-middleware');
const adminMiddleware = require('../middleware/adminMiddleware');

adminRouter.post('/newpost', adminController.createNewPostBlog);

module.exports = adminRouter;