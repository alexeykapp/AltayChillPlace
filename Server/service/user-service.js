const { client, authentication } = require('../models/models')
const bcrypt = require('bcrypt')
const { validationResult } = require('express-validator')
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
        const user = await client.findOne({ where: { mail_client: email } })
        if (!user) {
            throw ApiError.BadRequest('The user with this email was not found')
        }
        const hashPassword = user.password_client;
        const isPasswordEquals = await bcrypt.compare(password, hashPassword)
        if (!isPasswordEquals) {
            throw ApiError.BadRequest(`Invalid password`)
        }
        const userDto = new UserDto(user)
        const tokens = tokenService.generateTokens({ ...userDto })

        await tokenService.saveToken(userDto.id, tokens.refreshToken)
        return { ...tokens, user: userDto }
    }
    async logout(refreshToken) {
        const token = await tokenService.removeToken()
    }
}

module.exports = new UserService();