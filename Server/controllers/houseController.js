const { getAllHouses } = require("../service/booking-service");
const houseService = require('../service/house-service');

class HouseController {
    async getAllHouses(req, res, next) {
        try {
            const houses = await houseService.getAllHouse();
            res.json(houses);
        }
        catch (err) {
            next(err);
        }
    }
    async getHousesByDate(req, res, next) {
        try {
            const { arrival, departure } = req.query;
            let arrivalDate = new Date(arrival);
            let departureDate = new Date(departure);
            const availableHouses = await houseService.getHousesByDate(arrivalDate, departureDate);
            res.json(availableHouses);
        }
        catch (err) {
            next(err);
        }
    }
    async getHouseById(req, res, next) {
        try {
            const idHouse = parseInt(req.params.id);
            const allInfoHouse = await houseService.getHouseById(idHouse);
            res.json(allInfoHouse);
        }
        catch (err) {
            next(err);
        }
    }
}

module.exports = new HouseController();