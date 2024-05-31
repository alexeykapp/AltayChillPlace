const servicesService = require('../service/services-service');
const { ser } = require('../models/models')

class ServicesController {
    async getAllServices(req, res, next) {
        try {
            const listService = await servicesService.getAllServices();
            res.json(listService);
        }
        catch (err) {
            next(err);
        }
    }
    async getTypesService(req, res, next) {
        try {
            const listType = await servicesService.getTypeService();
            res.json(listType);
        }
        catch (err) {
            next(err);
        }
    }
}

module.exports = new ServicesController();