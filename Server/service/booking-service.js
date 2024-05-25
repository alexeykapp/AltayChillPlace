const bookingHouseService = require('./house-service');
const { reservation_request } = require('../models/models')
const existService = require('../helpers/checkExists');
const ApiError = require('../error/api-error');

class BookingService {
    async createRequest(requestBooking) {
        const resultCheck = await existService.existHouseAndClient()
        if (resultCheck == false) {
            throw ApiError.BadRequest("Check the transmitted IDs");
        }
        const bookingRequest = await reservation_request.create({
            arrival_date: requestBooking.arrivalDate,
            date_of_departure: requestBooking.departureDate,
            number_of_persons: requestBooking.numberOfPeople,
            fk_client: requestBooking.id_client,
            fk_house: requestBooking.id_house
        });
        return bookingRequest;
    }
}

module.exports = new BookingService();