const express = require('express');
const houseRouter = express.Router();
const houseController = require('../controllers/houseController');
const validateHouseData = require('../middleware/validateHouseData')

houseRouter.get('/all', houseController.getAllHouses);
houseRouter.get('/house/:id', houseController.getHouseById);
houseRouter.post('/createnew', validateHouseData, houseController.createHouse)
houseRouter.get('/photos/:id', houseController.getPhotoHouseById);
houseRouter.get('/availableHouses', houseController.getHousesByDate);
// Редактирование
houseRouter.put('/house/:id', houseController.updateHouse);
houseRouter.delete('/house/:id', houseController.deleteHouse);
houseRouter.post('/house/:id/addphoto', houseController.addHousePhoto);
houseRouter.delete('/photos/:id', houseController.deleteHousePhoto);

module.exports = houseRouter;