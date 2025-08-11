const Joi = require("joi");

const Get = Joi.object({
  agency_id: Joi.string().required(),
});
const Filter = Joi.object({
  agency_id: Joi.string(),
  category: Joi.string(),
  type: Joi.string(),
});
const Delete = Joi.object({
  _id: Joi.string().required(),
});
const Create = Joi.object({
  name: Joi.string().required(),
  category: Joi.string().required(),
  // description: Joi.string().required(),
  type: Joi.string().required(),
  super_admin_subcat: Joi.string(),
  agency_id: Joi.string(),
});

const Update = Joi.object({
  _id: Joi.string().required(),
  languages: Joi.array(),
  category: Joi.string(),
  // description: Joi.string(),
  status: Joi.string(),
  super_admin_subcat: Joi.string(),
  type: Joi.string(),
  agency_id: Joi.string(),
  name: Joi.string(),
});

module.exports = {
  Get,
  Delete,
  Filter,
  Update,
  Create,
};
