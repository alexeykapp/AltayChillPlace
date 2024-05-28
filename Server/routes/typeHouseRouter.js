const express = require('express');
const typeHouseRouter = express.Router();
const controller = require('../controllers/typeHouseController')

typeHouseRouter.get('/all', controller.getAllTypeHouse);

module.exports = typeHouseRouter;