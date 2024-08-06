const express = require("express");
const router = express.Router();
const { celebrate } = require("celebrate");
const schema = require("./schema.js");

const controller = require("./controller.js");

router.post(
  "/doctor_registration",
  celebrate(schema.doctorRegistrationValidationSchema, schema.options),
  controller.registerUser
);

module.exports = router;
