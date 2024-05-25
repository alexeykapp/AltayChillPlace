const { client, additional_service, house } = require('../models/models')

class CheckExist {
    async existClient(idClient) {
        const clientFind = await additional_service.findByPk(idClient);
        if (!clientFind) {
            return false;
        }
        return true;
    }
    async existService(idService) {
        const serviceFind = await additional_service.findByPk(idService);
        if (!serviceFind) {
            return false;
        }
        return true;
    }
    async existHouse(idHouse) {
        const houseFind = await house.findByPk(idHouse);
        if (!houseFind) {
            return false;
        }
        return true;
    }
    async existHouseAndClient(idHouse, idClient) {
        const resultHouse = await this.existHouse(idHouse);
        const resultService = await this.existClient(idClient);
        if (resultHouse == false || resultService == false) {
            return false;
        }
        return true;
    }
}

module.exports = new CheckExist();