const bookingService = require('../service/booking-service');
const serviceServices = require('../service/services-service');
const ApiError = require('../error/api-error');


class BookingController {
    async createBookingRequest(req, res, next) {
        try {
            const { id_client, id_house, numberOfPeople, arrivalDate, departureDate } = req.body.booking;
            console.log(req.body);
            const booking = await bookingService.createRequest(id_client, id_house, numberOfPeople, arrivalDate, departureDate);
            const services = req.body.services;
            if (!services) {
                return res.json(booking);
            }
            const bookingServices = await serviceServices.createServicesBooking(services, booking.id_reservation_request);
            return res.json({ booking, bookingServices });
        }
        catch (err) {
            next(err);
        }

    }
    async cancelBookingRequest(req, res, next) {

    }
    async getHistoryBooking(req, res, next) {
        try {
            const idClient = parseInt(req.params.id);
            const history = await bookingService.getHistoryBooking(idClient);
            return res.json(history);
        }
        catch (err) {
            next(err);
        }
    }
}

module.exports = new BookingController();