const express = require('express');
const serviceRouter = express.Router();
const serviceController = require('../controllers/servicesController');

serviceRouter.get('/all', serviceController.getAllServices);
serviceRouter.get('/types', serviceController.getTypesService);

module.exports = serviceRouter;