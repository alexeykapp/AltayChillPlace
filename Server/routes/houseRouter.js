const express = require('express');
const houseRouter = express.Router();
const houseController = require('../controllers/houseController');

houseRouter.get('/all', houseController.getAllHouses);
houseRouter.get('/availableHouses', houseController.getHousesByDate)

module.exports = houseRouter;