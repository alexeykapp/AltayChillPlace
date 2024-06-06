const { validationResult } = require('express-validator')
const userService = require('../service/user-service')

class UserController {
    async registration(req, res, next) {
        try {
            const { phone, email, password, dateOfBirth, last_name, middle_name, first_name, device } = req.body
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({ message: errors })
            }
            const userData = await userService.registration(phone, email, password, dateOfBirth, last_name, middle_name, first_name, device)
            res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true })
            return res.json(userData)
        }
        catch (err) {
            next(err)
        }
    }
    async login(req, res, next) {
        try {
            const { phone, password } = req.body;
            if (!phone || !password) {
                return res.status(400).json({ message: "One of the fields is empty" })
            }
            const userData = await userService.login(phone, password);
            res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true })
            return res.json(userData)
        }
        catch (err) {
            next(err)
        }
    }
    async logout(req, res, next) {
        try {
            const { refreshToken } = req.body;
            const token = await userService.logout(refreshToken);
            res.clearCookie('refreshToken')
            return res.status(200).send('OK');
        }
        catch (err) {
            next(err);
        }
    }
    async refresh(req, res, next) {
        try {
            const { refreshToken } = req.cookies;
            console.log('Token - ' + refreshToken);
            const userData = await userService.refresh(refreshToken);
            res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true })
            return res.json(userData);
        }
        catch (err) {
            next(err)
        }
    }
    async getUsers(req, res, next) {
        try {
            const users = await userService.getAllUsers();
            return res.json(users);
        }
        catch (err) {
            next(err);
        }
    }
}

module.exports = new UserController()