const Joi = require("joi");

const Get = Joi.object({
  agency_id: Joi.string().required(),
});
const Filter = Joi.object({
  type: Joi.string().required(),
  agency_id: Joi.string(),
});
const Delete = Joi.object({
  _id: Joi.string().required(),
});
const Create = Joi.object({
  name: Joi.string().required(),
  description: Joi.string(),
  image_url: Joi.string(),
  type: Joi.string().required(),
  super_admin_cat: Joi.string(),
  agency_id: Joi.string(),
});

const Update = Joi.object({
  _id: Joi.string().required(),
  name: Joi.string(),
  status: Joi.string(),
  type: Joi.string(),
  agency_id: Joi.string(),
  languages: Joi.array(),
  super_admin_cat: Joi.string(),
  description: Joi.string(),
  image: Joi.string(),
});

module.exports = {
  Get,
  Delete,
  Filter,
  Update,
  Create,
};
