const Joi = require("joi")

const Signup = Joi.object({
    username: Joi.string().required(),
    email: Joi.string().email(),
    password: Joi.string().min(8),
    role: Joi.string().required(),
    phone: Joi.string(),
})

const Login = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    location_id: Joi.string(),
    role: Joi.string()
})

module.exports = {
    Signup,
    Login,
}