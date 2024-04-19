const { client, authentication } = require('../models/models')
const bcrypt = require('bcrypt')
const { validationResult } = require('express-validator')
const TokenService = require('../service/token-service')
const UserDto = require('../dtos/user-dto')

class UserService {
    async registration(phone, email, password, dateOfBirth, fullName, device) {
        /*const candidate = await client.findOne({ where: { mail_client: email } })
        if (candidate) {
            throw new Error('Пользователь с таким email уже существует')
        }*/
        const hashPassword = bcrypt.hashSync(password, 7)
        const newClient = await client.create({ full_name_client: fullName, date_of_birth_client: dateOfBirth, phone_number_client: phone, mail_client: email, password_client: hashPassword })
        const userDto = new UserDto(newClient)
        const tokens = TokenService.generateTokens({ ...userDto })
        const auth = await authentication.create({ fk_client: userDto.id, token: tokens.refreshToken, type_device: device })
        return { tokens, user: UserDto }
        //await TokenService.saveToken(userDto.id, tokens.refreshToken)
    }
}

module.exports = new UserService();