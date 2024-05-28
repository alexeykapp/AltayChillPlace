const { type_of_number } = require('../models/models')

class TypeHouseService {
    async getAllTypeHouse() {
        const types = await type_of_number.findAll();
        return types;
    }
}

module.exports = new TypeHouseService();