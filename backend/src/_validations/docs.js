const Joi = require("joi");

const Get = Joi.object({
  agency_id: Joi.string().required(),
});
const Filter = Joi.object({
  type: Joi.string().required(),
  agency_id: Joi.string(),
  skip: Joi.string(),
  category: Joi.string(),
  sub_category: Joi.string(),
});
const Delete = Joi.object({
  _id: Joi.string().required(),
});
const Create = Joi.object({
  doc: Joi.string().required(),
  cover_img: Joi.string().allow(""),
  title: Joi.string().required(),
  status: Joi.string(),
  category: Joi.string().required(),
  sub_category: Joi.string().required(),
  agency_id: Joi.string(),
  languages: Joi.array(),
  super_admin_doc: Joi.string(),
  type: Joi.string().required(),
});

const Update = Joi.object({
  _id: Joi.string().required(),
  doc: Joi.string(),
  status: Joi.string(),
  category: Joi.string(),
  languages: Joi.array(),
  sub_category: Joi.string(),
  version: Joi.string(),
  agency_id: Joi.string(),
  type: Joi.string(),
  super_admin_doc: Joi.string(),
  version_type: Joi.string(),
  cover_img: Joi.string().allow(""),
  title: Joi.string(),
});

module.exports = {
  Get,
  Delete,
  Filter,
  Update,
  Create,
};
