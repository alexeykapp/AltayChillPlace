const Router = require('express')
const router = new Router()
const userController = require('../controllers/userController')
const { check } = require('express-validator')

router.post('/registration', [
    check('phone', "Пустой логин").notEmpty(),
    check('password', "Пустой пароль").notEmpty(),
    check('phone', "Invalid phone number").isMobilePhone(),
    check('password', "Password must be at least 6 characters long").isLength({ min: 6 })
], userController.registration)

router.post('/login', userController.login)
router.post('/create', userController.create)
router.get('/auth', userController.auth)

module.exports = router