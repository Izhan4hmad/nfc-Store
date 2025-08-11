const Joi = require("joi")

const Stripe = Joi.object({
  customer_id     : Joi.string(),
  subscription_id : Joi.string()
})

const Agency = Joi.object({
  contact_id : Joi.string(),
  agency_id  : Joi.string()
})

const Intermedial = Joi.object({
  location_id : Joi.string(),
  user_id     : Joi.string()
})

const GHL = Joi.object({
  access_token  : Joi.string(),
  refresh_token : Joi.string(),
  api_key       : Joi.string(),
  location_id   : Joi.string(),
  company_id    : Joi.string(),
  agency_key    : Joi.string()
})

const Create = Joi.object({
  name        : Joi.string().required(),
  stripe      : Stripe,
  agency      : Agency,
  Intermedial : Intermedial,
  ghl         : GHL,
  createdBy   : Joi.string().required(),
})

const Get = Joi.object({
  _id : Joi.string().required()
})

const Update = Joi.object({
  _id         : Joi.string().required(),
  name        : Joi.string(),
  stripe      : Stripe,
  agency      : Agency,
  Intermedial : Intermedial,
  ghl         : GHL,
  createdBy   : Joi.string(),
})

const Query = Joi.object({
  "ghl.location_id" : Joi.string()
})

module.exports = {
  Create,
  Get,
  Update,
  Query
}