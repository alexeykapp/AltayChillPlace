const { getAllHouses } = require("../service/booking-service");
const houseService = require('../service/house-service');
const sharp = require('sharp');

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
    async getPhotoHouseById(req, res, next) {
        try {
            const idHouse = parseInt(req.params.id);
            const allPhotos = await houseService.getPhotoHouseById(idHouse);
            const compressedPhotosHouse = await Promise.all(allPhotos.photosHouse.map(photo =>
                sharp(photo)
                    .jpeg({ quality: 70 })
                    .toBuffer()
            ));

            const compressedPhotosRoom = await Promise.all(allPhotos.photosRoom.map(photo =>
                sharp(photo)
                    .jpeg({ quality: 70 })
                    .toBuffer()
            ));

            res.json({
                photosHouse: compressedPhotosHouse.map(photo => photo.toString('base64')),
                photosRoom: compressedPhotosRoom.map(photo => photo.toString('base64'))
            });
        }
        catch (err) {
            next(err);
        }
    }
}

module.exports = new HouseController();