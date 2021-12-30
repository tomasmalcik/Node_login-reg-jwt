const joi = require("joi")
const mongoose = require("mongoose")

const registerValidation = (data) => {
    const registerSchema = joi.object({
        reg_name: joi.string().min(6).required()
        .messages({
            'string.min': 'Name should be at least 6 characters long',
            'string.empty': 'Name is required'
        }),
        reg_surname: joi.string().min(6).required()
        .messages({
            'string.min': 'Surname should be at least 6 characters long',
            'string.empty': 'Surname is required'
        }),
        reg_email: joi.string().min(6).required().email()
        .messages({
            'string.min': 'Emails should be at least 6 characters long',
            'string.email': 'Email is invalid',
            'string.empty': 'Email is required'
        }),
        reg_password: joi.string().min(6).required().label("Password")
        .messages({
            'string.min': 'Password should be at least 6 characters long',
            'string.empty': 'Password is required'
        }),
        reg_password2: joi.any().equal(joi.ref('reg_password')).required().label("Confirm password").messages({
            'any.only': 'Password dont match'
         })
    })
    return registerSchema.validate(data)
}

const loginValidation = (data) => {
    const registerSchema = joi.object({
        log_email: joi.string().min(6).required().email().messages({
            'string.email': 'Enter email in the correct form (a@b.com)',
            'string.min': 'Email should be at least 6 characters long',
          }),
        log_password: joi.string().min(6).required().messages({
            'string.empty': 'Password cannot be empty',
            'string.min': 'Password is at least 6 characters long'
        })

    })
    return registerSchema.validate(data, {abortEarly: false})
}

const workspaceValidation = (data) => {
    console.log(data)
    const workSchema = joi.object({
        title: joi.string().min(3).required().messages({
            'string.min': 'Title should be at least 3 characters long',
            'string.empty': 'Title cannot be empty'
        })
    })
    return workSchema.validate(data, {abortEarly: false})
}


module.exports.registerValidation = registerValidation
module.exports.loginValidation = loginValidation
module.exports.workspaceValidation = workspaceValidation