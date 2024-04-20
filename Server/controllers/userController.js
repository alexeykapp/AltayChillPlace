const { validationResult } = require('express-validator')
const userService = require('../service/user-service')
const e = require('express')

class UserController {
    async registration(req, res, next) {
        try {
            const { phone, email, password, dateOfBirth, fullName, device } = req.body
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({ message: errors })
            }
            const userData = await userService.registration(phone, email, password, dateOfBirth, fullName, device)
            res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true })
            return res.json(userData)
        }
        catch (err) {
            next(err)
        }
    }
    async login(req, res, next) {
        try {
            const { email, password } = req.body;
            const userData = await userService.login(email, password);
            res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true })
            return res.json(userData)
        }
        catch (err) {
            next(err)
        }

    }
}

module.exports = new UserController()