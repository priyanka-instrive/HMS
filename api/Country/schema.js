const Joi = require("joi");

module.exports.options = {
  abortEarly: false,
  convert: true,
  stripUnknown: true,
};

const getAllByParams = {
  params: Joi.object().keys({
    key: Joi.string().required(),
  }),
};

const deleteSchema = {
  params: Joi.object().keys({
    key: Joi.string().required(),
  }),
};

const updateSchema = {
  body: Joi.object().keys({
    name: Joi.string().optional(),
    code: Joi.string().optional(),
  }),
};

module.exports = { getAllByParams, deleteSchema, updateSchema };
