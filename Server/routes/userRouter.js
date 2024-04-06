const Router = require('express')
const router = new Router()
const userController = require('../controllers/userController')
const { registrationValidationRules, validate } = require('../middleware/validationMiddleware')

router.post('/registration', registrationValidationRules, validate, userController.registration)
router.post('/login', userController.login)
router.post('/create', userController.create)
router.get('/auth', userController.auth)

module.exports = router