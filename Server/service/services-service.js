const { additional_service } = require('../models/models');

class ServicesService {
    async getAllServices() {
        const services = await additional_service.findAll();
        return services;
    }
}

module.exports = new ServicesService();