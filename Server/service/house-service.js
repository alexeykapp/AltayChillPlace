const { house, reservation_request, photos_rooms } = require('../models/models');
const { Op, Sequelize } = require('sequelize');
const sharp = require('sharp');
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

        // Найдем все домики, которые не включены в список забронированных
        const availableHouses = await house.findAll({
            where: {
                id_house: {
                    [Op.notIn]: bookedHouseIds // Вот тут мы и исключаем все занятые домики
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
}

module.exports = new HouseService();