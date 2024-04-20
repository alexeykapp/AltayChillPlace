const { client, authentication } = require('../models/models')
const bcrypt = require('bcrypt')
const TokenService = require('../service/token-service')
const UserDto = require('../dtos/user-dto')
const ApiError = require('../error/api-error')
const tokenService = require('../service/token-service')

class UserService {
    async registration(phone, email, password, dateOfBirth, fullName, device) {
        const candidate = await client.findOne({ where: { mail_client: email } })
        if (candidate) {
            throw ApiError.BadRequest(`Пользователь с таким email: ${email} уже существует`)
        }
        console.log(`'${password}'`);
        const hashPassword = await bcrypt.hash(password, 7)
        const newClient = await client.create({ full_name_client: fullName, date_of_birth_client: dateOfBirth, phone_number_client: phone, mail_client: email, password_client: hashPassword })
        const userDto = new UserDto(newClient)
        const tokens = TokenService.generateTokens({ ...userDto })
        const auth = await authentication.create({ fk_client: userDto.id, token: tokens.refreshToken, type_device: device })
        return { tokens, user: UserDto }
        //await TokenService.saveToken(userDto.id, tokens.refreshToken)
    }
    async login(email, password) {
        const user = await client.findOne({ where: { mail_client: email } });
        if (!user) {
            throw ApiError.BadRequest('The user with this email was not found');
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
        const tokens = await tokenService.generateTokens({ ...userDto });
        await tokenService.saveToken(userDto.id, tokens.refreshToken);
        return { ...tokens, user: userDto };
    }
    async getAllUsers() {
        const users = await client.findAll()
        return users;
    }
}

module.exports = new UserService();