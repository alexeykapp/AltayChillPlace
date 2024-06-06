const profileService = require('../service/profileService');

class ProfileController {
    async getInfoProfile(req, res, next) {
        try {
            const idUser = parseInt(req.params.id);
            const profile = await profileService.getInfoProfile(idUser);
            return res.json(profile);
        }
        catch (err) {
            next(err);
        }
    }
    async profileUpdate(req, res, next) {
        try {
            const { id } = req.body;
            const userData = req.body;
            const result = await profileService.profileUpdate(id, userData);
            return res.json(result);
        }
        catch (err) {
            next(err)
        }
    }

}

module.exports = new ProfileController();