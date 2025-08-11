const Joi = require('joi')

const GHLservices = Joi.object({
  key           : Joi.string().when('headers', {is: Joi.object(), otherwise: Joi.string().required()}),
  method        : Joi.string().required(),
  path          : Joi.string().required(),
  refresh_token : Joi.string(),
  version       : Joi.string(),
  query         : Joi.string(),
  payload       : Joi.any(),
  headers       : Joi.object()
}).unknown()

module.exports = {
  GHLservices
}
