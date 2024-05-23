const { client } = require('../models/models');
const ProfileDto = require('../dtos/profileDto');
const ApiError = require('../error/api-error');

class ProfileService {
    async getInfoProfile(id) {
        const user = await client.findByPk(id);
        if (!user) {
            throw new Error('The user was not found');
        }
        const profileDto = new ProfileDto(user);
        return profileDto;
    }
}

module.exports = new ProfileService();