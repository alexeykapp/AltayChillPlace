const { getAllHouses } = require("../service/booking-service");
const houseService = require('../service/house-service');
const sharp = require('sharp');
const HouseDto = require('../dtos/HouseDto');

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
                photosHouse: compressedPhotosHouse,
                photosRoom: compressedPhotosRoom
            });
        }
        catch (err) {
            next(err);
        }
    }
    async createHouse(req, res, next) {
        try {
            const { houseData, photos } = req.body;

            const createdHouse = await houseService.createHouseWithPhotos(houseData, photos);

            const houseDto = new HouseDto(createdHouse);

            res.status(201).json(houseDto);
        } catch (err) {
            next(err)
        }
    }
    async updateHouse(req, res, next) {
        try {
            const idHouse = parseInt(req.params.id);
            const houseData = req.body;

            const updatedHouse = await houseService.updateHouse(idHouse, houseData);

            res.json(updatedHouse);
        } catch (err) {
            next(err);
        }
    }
    async deleteHouse(req, res, next) {
        try {
            const idHouse = parseInt(req.params.id);

            await houseService.deleteHouse(idHouse);

            res.status(204).send();
        } catch (err) {
            next(err);
        }
    }
    async addHousePhoto(req, res, next) {
        try {
            const idHouse = parseInt(req.params.id);
            const { photo } = req.body;

            const newPhoto = await houseService.addHousePhotos(idHouse, photo);

            res.status(201).json(newPhoto);
        } catch (err) {
            next(err);
        }
    }

    async deleteHousePhoto(req, res, next) {
        try {
            const idPhoto = parseInt(req.params.id);

            await houseService.deleteHousePhoto(idPhoto);

            res.status(204).send();
        } catch (err) {
            next(err);
        }
    }

}

module.exports = new HouseController();