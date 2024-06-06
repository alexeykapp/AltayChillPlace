// services/profileService.js

const { client } = require('../models/models');
const ProfileDto = require('../dtos/profileDto');
const ApiError = require('../error/api-error');
const { where } = require('sequelize');

class ProfileService {
    async getInfoProfile(id) {
        const user = await client.findByPk(id);
        if (!user) {
            throw new Error('The user was not found');
        }
        const profileDto = new ProfileDto(user);
        return profileDto;
    }

    async profileUpdate(id_client, updatedUser) {
        console.log('Starting profile update...');

        // Извлекаем все соответствующие обновляемые поля и меняем их названия под базу данных
        const { email, phone, dateOfBerth, ...rest } = updatedUser;
        const dataToUpdate = {
            first_name: rest.first_name,
            middle_name: rest.middle_name,
            last_name: rest.last_name,
            mail_client: email,
            phone_number_client: phone,
            date_of_birth_client: dateOfBerth
        };

        console.log('Updated User Data:', dataToUpdate);

        const [numberOfAffectedRows, affectedRows] = await client.update(dataToUpdate, {
            where: { id_client },
            returning: true,
        });
        console.log('Update Result:', numberOfAffectedRows, affectedRows);

        if (numberOfAffectedRows === 0) {
            throw new Error('User not found');
        }

        const profile = new ProfileDto(affectedRows[0]);
        return profile;
    }
}

module.exports = new ProfileService();