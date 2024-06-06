const { client, additional_service, house } = require('../models/models')

class CheckExist {
    async existClient(idClient) {
        const clientFind = await client.findByPk(idClient);
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
        console.log('ID house -' + idHouse + 'ID client - ' + idClient)
        const resultHouse = await this.existHouse(idHouse);
        const resultService = await this.existClient(idClient);
        console.log('ID house -' + resultHouse + 'ID client - ' + resultService)
        if (resultHouse == false || resultService == false) {
            return false;
        }
        return true;
    }
}

module.exports = new CheckExist();