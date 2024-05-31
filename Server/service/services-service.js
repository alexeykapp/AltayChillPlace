const ApiError = require('../error/api-error');
const { additional_service, composition_of_application_additional_services, service_type } = require('../models/models');

class ServicesService {
    async getAllServices() {
        const services = await additional_service.findAll();
        return services;
    }
    async createServicesBooking(servicesBooking, idBookingRequest) {
        let serviceBookingList = [];
        await checkExistServices(servicesBooking);
        for (let serviceId of servicesBooking) {
            serviceBookingList.push(await composition_of_application_additional_services.create({
                fk_additional_service: serviceId,
                fk_reservation_request: idBookingRequest
            }));
        }
        return serviceBookingList;
    }
    async getTypeService() {
        const types = await service_type.findAll();
        return types;
    }
}
async function checkExistServices(servicesBooking) {
    for (let serviceId of servicesBooking) {
        const serviceExist = await additional_service.findByPk(serviceId);
        if (!serviceExist) {
            throw ApiError.BadRequest(`Service with id=${serviceId} does not exist`);
        }
    }
}
module.exports = new ServicesService();