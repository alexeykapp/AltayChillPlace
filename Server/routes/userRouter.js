const express = require('express'); // Импорт express
const router = express.Router(); // Создание экземпляра Router
const userController = require('../controllers/userController');
const { registrationValidationRules, validate } = require('../middleware/validationMiddleware');

router.post('/registration', registrationValidationRules(), validate, userController.registration);

module.exports = router;
