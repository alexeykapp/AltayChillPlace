const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const bookingRouter = require('./bookingRouter');
const { registrationValidationRules, validate } = require('../middleware/validationMiddleware');
const authMiddleware = require('../middleware/auth-middleware')

router.post('/registration', registrationValidationRules(), validate, userController.registration);
router.post('/login', userController.login);
router.post('/logout', userController.logout);
router.get('/refresh', userController.refresh);
router.get('/users', authMiddleware, userController.getUsers);

router.use('/booking/', authMiddleware, bookingRouter);

module.exports = router;
