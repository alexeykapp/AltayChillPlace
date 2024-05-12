const bookingHouseService = require('./house-service');

class BookingService {
    async getHousesByDate(arrivalDate, departureDate) {

    }
    async getAllHouses() {
        return bookingHouseService.getAllHouses();
    }
}

module.exports = new BookingService();