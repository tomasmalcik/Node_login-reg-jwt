const joi = require("joi")

const registerValidation = (data) => {
    const registerSchema = joi.object({
        name: joi.string().min(6).required(),
        email: joi.string().min(6).required().email(),
        password: joi.string().min(6).required().label("Password"),
        password2: joi.any().equal(joi.ref('Password')).required().label("Confirm password").messages({ 'any.only': '{{#label}} does not match' })
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