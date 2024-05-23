const express = require('express');
const profileRouter = express.Router();

const profileController = require('../controllers/profileController');
const authMiddleware = require('../middleware/auth-middleware');

profileRouter.get('/info/:id', profileController.getInfoProfile);

module.exports = profileRouter;