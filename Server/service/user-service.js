const { client, authentication } = require('../models/models')
const bcrypt = require('bcrypt')
const moment = require("moment");
const TokenService = require('../service/token-service')
const UserDto = require('../dtos/user-dto')
const ApiError = require('../error/api-error')
const tokenService = require('../service/token-service');
const ProfileDto = require('../dtos/profileDto');

class UserService {
    async registration(phone, email, password, dateOfBirth, last_name, middle_name, first_name, device) {
        try {
            const candidate = await client.findOne({ where: { mail_client: email } })
            if (candidate) {
                throw ApiError.BadRequest(`A user with this email already exists`)
            }
            const hashPassword = await bcrypt.hash(password, 7)
            const date = moment(dateOfBirth, "DD-MM-YYYY").toDate();
            const newClient = await client.create({ last_name: last_name, middle_name: middle_name, first_name: first_name, date_of_birth_client: date, phone_number_client: phone, mail_client: email, password_client: hashPassword })
            const userDto = new UserDto(newClient)
            const tokens = TokenService.generateTokens({ ...userDto })
            const auth = await authentication.create({ fk_client: userDto.id, token: tokens.refreshToken, type_device: device })
            console.log('New user: ' + email);
            return { tokens }
        }
        catch (err) {
            console.log('Error registration service:' + err);
            throw ApiError.ServerError();
        }
    }
    async login(phone, password) {
        const user = await client.findOne({ where: { phone_number_client: phone } });
        if (!user) {
            throw ApiError.BadRequest('The user with this phone was not found');
        }
        const hashPassword = user.password_client;
        const isPasswordEquals = await bcrypt.compare(password, hashPassword);
        if (!isPasswordEquals) {
            throw ApiError.BadRequest(`Invalid password`);
        }
        return await this.createUserDtoAndGenerateTokens(user);
    }
    async logout(refreshToken) {
        const token = await tokenService.removeToken(refreshToken);
        return token;
    }
    async refresh(refreshToken) {
        if (!refreshToken) {
            throw ApiError.UnauthorizedError();
        }
        const validateToken = tokenService.validateRefreshToken(refreshToken);
        const user = await tokenService.findClientToken(refreshToken);
        if (!validateToken || !user) {
            throw ApiError.UnauthorizedError();
        }
        return await this.createUserDtoAndGenerateTokens(user);
    }
    async createUserDtoAndGenerateTokens(user) {
        const userDto = new UserDto(user);
        const profileDto = new ProfileDto(user);
        const tokens = await tokenService.generateTokens({ ...userDto });
        await tokenService.saveToken(userDto.id, tokens.refreshToken);
        return { ...tokens, user: profileDto };
    }
    async getAllUsers() {
        const users = await client.findAll()
        return users;
    }
}

module.exports = new UserService();