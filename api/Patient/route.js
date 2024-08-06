const express = require("express");
const router = express.Router();
const { celebrate } = require("celebrate");
const schema = require("./schema.js");

const controller = require("./controller.js");

router.post(
  "/patient_registration",
  celebrate(schema.patientRegistrationValidationSchema, schema.options),
  controller.registerUser
);

module.exports = router;
