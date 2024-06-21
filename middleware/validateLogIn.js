const { check, email } = require('express-validator');

const validateLogin = [
    check('password').notEmpty().withMessage('Password is required'),
    email([
        check('email').isEmail()
    ], 'Email is required')
];


module.exports = {
    validateLogin
}