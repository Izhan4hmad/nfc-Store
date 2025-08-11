const Joi = require("joi")

const Get = Joi.object({
  _id: Joi.string().required()
})

module.exports = {
  Get
}