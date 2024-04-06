const { check, body } = require('express-validator')

/*const registrationValidationRules = () => {
    return [
        check('full_name_client', 'Empty')
        check('phone', "Empty phone number").notEmpty(),
        check('password', "The password must be at least 6 characters long, contain at least one digit and a special character")
            .isLength({ min: 6 })
            .matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,}$/),
        check('phone', "Invalid phone number").isMobilePhone('ru-RU'),
        check('phone', "Incorrect phone number").isLength({ min: 11, max: 12 })
    ]
}*/
const registrationValidationRules = () => {
    return [
        body('phone')
            .notEmpty().withMessage("Empty phone number")
            .isMobilePhone('ru-RU').withMessage("Invalid phone number")
            .isLength({ min: 10, max: 12 }).withMessage("Incorrect phone number length"),
        body('password')
            .notEmpty().withMessage("Empty password")
            .isLength({ min: 6 }).withMessage("Password must be at least 6 characters long")
            .matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,}$/)
            .withMessage("Password must be at least 6 characters long, contain at least one digit and a special character"),
        body('full_name_client')
            .notEmpty().withMessage("Empty full name")
            .matches(/^[А-Яа-яЁё]+[\s][А-Яа-яЁё]+[\s][А-Яа-яЁё]+$/)
            .withMessage("Incorrect full name"),
        body('date_of_birth_client')
            .notEmpty().withMessage("Empty date of birth")
            .isDate({ format: 'DD-MM-YYYY' }).withMessage('Invalid date format'),
        body('mail_client')
            .notEmpty().withMessage("Empty email")
            .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/).withMessage('Invalid email')
    ]
}
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        return next();
    }
    console.log(errors)
    return res.status(422).json({ errors: errors.array() });
}

module.exports = {
    registrationValidationRules,
    validate
};