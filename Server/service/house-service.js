const { house, reservation_request, photos_rooms } = require('../models/models');
const { Op, Sequelize } = require('sequelize');
const sharp = require('sharp');
const HouseDto = require('../dtos/HouseDto');
const sequelize = require('../db');
class HouseService {

    async getAllHouse() {
        const houses = await house.findAll();
        return houses;
    }
    async getHousesByDate(desiredArrival, desiredDeparture) {
        const overlappingReservations = await reservation_request.findAll({
            where: {
                [Op.or]: [{
                    arrival_date: {
                        [Op.between]: [desiredArrival, desiredDeparture]
                    }
                }, {
                    date_of_departure: {
                        [Op.between]: [desiredArrival, desiredDeparture]
                    }
                }]
            }
        });
        const bookedHouseIds = overlappingReservations.map(reservation => reservation.fk_house);

        const availableHouses = await house.findAll({
            where: {
                id_house: {
                    [Op.notIn]: bookedHouseIds
                }
            }
        });
        return availableHouses;
    }

    async getHouseById(idHouse) {
        const houseFind = await house.findByPk(idHouse);
        if (houseFind.length == 0) {
            throw new Error('There is no house with this id in the database');
        }
        const photosHouse = await photos_rooms.findAll({
            where: {
                fk_house: idHouse
            }
        });
        const allInfoHouse = {
            houseFind,
            photosHouse: photosHouse.length ? photosHouse : 'No images found'
        };
        return allInfoHouse;
    }
    async getPhotoHouseById(idHouse) {
        const photosHouse = await house.findByPk(idHouse, {
            attributes: ['photo_of_the_room'],
        });
        const photosRoom = await photos_rooms.findAll({
            where: {
                fk_house: idHouse,
            },
            attributes: ['photo_of_the_room'],
        });
        return {
            photosHouse: photosHouse ? [photosHouse.photo_of_the_room] : [],
            photosRoom: photosRoom.map(photo => photo.photo_of_the_room),
        };
    }
    async createHouseWithPhotos(houseData, photos) {
        const transaction = await sequelize.transaction();

        try {
            const createdHouse = await house.create(houseData, { transaction });
            const mainPhoto = photos.shift();
            createdHouse.photo_of_the_room = Buffer.from(mainPhoto);
            await createdHouse.save({ transaction });

            for (const photo of photos) {
                await photos_rooms.create({
                    photo_of_the_room: Buffer.from(photo),
                    fk_house: createdHouse.id_house,
                }, { transaction });
            }

            await transaction.commit();
            return createdHouse;
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }
    async updateHouse(idHouse, houseData) {
        const houseToUpdate = await house.findByPk(idHouse);
        if (!houseToUpdate) {
            throw new Error('The house with this ID was not found');
        }

        await houseToUpdate.update(houseData);

        return houseToUpdate;
    }
    async deleteHouse(idHouse) {
        const houseToDelete = await house.findByPk(idHouse);
        if (!houseToDelete) {
            throw new Error('The house with this ID was not found');
        }
        await houseToDelete.destroy();
    }
    async addHousePhotos(idHouse, photos) {
        const houseExists = await house.findByPk(idHouse);
        if (!houseExists) {
            throw new Error('The house with this ID was not found');
        }

        const addedPhotos = [];

        for (const photo of photos) {
            const newPhoto = await photos_rooms.create({
                photo_of_the_room: Buffer.from(photo),
                fk_house: idHouse,
            });
            addedPhotos.push(newPhoto);
        }

        return addedPhotos;
    }

    async deleteHousePhoto(idPhoto) {
        const photoToDelete = await photos_rooms.findByPk(idPhoto);
        if (!photoToDelete) {
            throw new Error('No photo with this ID was found');
        }

        await photoToDelete.destroy();
    }
}

module.exports = new HouseService();