const { check, body, validationResult } = require('express-validator')

const registrationValidationRules = () => {
    return [
        body('phone')
            .notEmpty().withMessage("Empty phone number")
            .matches(/^\+7\(\d{3}\)\d{3}-\d{2}-\d{2}$/).withMessage("Invalid phone number")
            .isLength({ min: 10, max: 18 }).withMessage("Incorrect phone number length"),
        body('password')
            .notEmpty().withMessage("Empty password")
            .isLength({ min: 6 }).withMessage("Password must be at least 6 characters long")
            .matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,}$/)
            .withMessage("Password must be at least 6 characters long, contain at least one digit and a special character"),
        body('fullName')
            .notEmpty().withMessage("Empty full name")
            .matches(/^[А-Яа-яЁё]+[\s][А-Яа-яЁё]+[\s][А-Яа-яЁё]+$/)
            .withMessage("Incorrect full name"),
        body('dateOfBirth')
            .notEmpty().withMessage("Empty date of birth")
            .matches(/^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-\d{4}$/).withMessage('Invalid date format'),
        body('email')
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