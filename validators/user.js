const Joi = require('joi');

const authValidator = Joi.object({
    email: Joi.string()
        .email()
        .required()
        .error(
            new Error('email should be a standard email')
        ),
    
    username: Joi.string()
            .required()
            .error(
                new Error('username is required')
            ),

    password: Joi.string()
        .required()
        .error(
            new Error('password is required')
        )

})

const loginValidator = Joi.object({
    email: Joi.string()
        .email()
        .required()
        .error(
            new Error('email should be a standard email')
        ),

    password: Joi.string()
        .required()
        .error(
            new Error('password is required')
        )

})


module.exports = {
    authValidator,
    loginValidator
}
