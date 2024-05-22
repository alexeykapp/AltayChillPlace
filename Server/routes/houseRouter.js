const express = require('express');
const houseRouter = express.Router();
const houseController = require('../controllers/houseController');

houseRouter.get('/all', houseController.getAllHouses);
houseRouter.get('/house/:id', houseController.getHouseById);
houseRouter.get('/availableHouses', houseController.getHousesByDate);

module.exports = houseRouter;