const Joi = require("joi")

const Get = Joi.object({
  _id: Joi.string().required()
})

const Update = Joi.object({
  _id: Joi.string().required(),
  sideNavColor: Joi.string().valid(...['primary', 'dark', 'info', 'success', 'warning', 'error']),
  sideNavType: Joi.string().valid(...['dark', 'transparent', 'white']),
  navbarFixed: Joi.boolean(),
  light: Joi.boolean(),
  domain: Joi.string(),
  logoUrl: Joi.string(),
  profile: Joi.object(),
  workflows: Joi.object(),
  domainUpdate: Joi.boolean(),
  agency_ghl: Joi.object(),
  ghl: Joi.object(),
})

module.exports = {
  Get,
  Update
}