const Joi = require("celebrate").Joi;

module.exports.options = {
  abortEarly: false,
  convert: true,
  stripUnknown: true,
};

const appointmentValidationSchema = {
  body: Joi.object().keys({
    doctorId: Joi.string().required(),
    patientId: Joi.string().required(),
    fromDate: Joi.date().required(),
    endDate: Joi.date().required(),
    reason: Joi.string(),
  }),
};

module.exports = { appointmentValidationSchema };
