const { house, reservation_request } = require('../models/models');
const { Op, Sequelize } = require('sequelize');
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
}

module.exports = new HouseService();