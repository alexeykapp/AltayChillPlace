const typeHouseService = require('../service/typeHouseService')
class TypeHouseController {
    async getAllTypeHouse(req, res, next) {
        try {
            const types = await typeHouseService.getAllTypeHouse();
            return res.json(types);
        }
        catch (err) {
            next(err);
        }
    }
}

module.exports = new TypeHouseController();