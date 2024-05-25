const bookingService = require('../service/booking-service');
const serviceServices = require('../service/services-service');
const ApiError = require('../error/api-error');

class BookingController {
    async createBookingRequest(req, res, next) {
        try {
            const requestBooking = req.body.booking;
            const services = req.body.services;
            const booking = await bookingService.createRequest(requestBooking);
            const bookingServices = await serviceServices.createServicesBooking(services, booking.id_reservation_request);
            return res.json({ booking, bookingServices });
        }
        catch (err) {
            next(err);
        }

    }
    async cancelBookingRequest(req, res, next) {

    }
}

module.exports = new BookingController();