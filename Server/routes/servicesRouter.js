const express = require('express');
const serviceRouter = express.Router();
const serviceController = require('../controllers/servicesController');

serviceRouter.get('/all', serviceController.getAllServices);

module.exports = serviceRouter;