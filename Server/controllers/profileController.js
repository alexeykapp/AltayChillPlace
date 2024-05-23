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
}

module.exports = new ProfileController();