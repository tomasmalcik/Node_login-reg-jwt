const joi = require("joi")

const registerValidation = (data) => {
    const registerSchema = joi.object({
        name: joi.string().min(6).required()
        .messages({
            'String.min': 'Name should be at least 6 characters long',
            'any.required': 'Name is required'
        }),
        email: joi.string().min(6).required().email()
        .messages({
            'String.min': 'Emails should be at least 6 characters long',
            'email.invalid': 'Email is invalid',
            'any.required': 'Email is required'
        }),
        password: joi.string().min(6).required().label("Password")
        .messages({
            'String.min': 'Password should be at least 6 characters long',
            'any.required': 'Password is required'
        }),
        password2: joi.any().equal(joi.ref('password')).required().label("Confirm password").messages({
            'any.only': 'Password dont match'
         })
    })
    return registerSchema.validate(data)
}

const loginValidation = (data) => {
    const registerSchema = joi.object({
        email: joi.string().min(6).required().email(),
        password: joi.string().min(6).required()

    })
    return registerSchema.validate(data)
}


module.exports.registerValidation = registerValidation
module.exports.loginValidation = loginValidation