const express = require("express");
const router = express.Router();
const { celebrate } = require("celebrate");
const schema = require("./schema.js");

const controller = require("./controller.js");
const { authenticate } = require("../../system/middleware/authentication.js");

router.post(
  "/schedule_appoinment",
  celebrate(schema.appointmentValidationSchema, schema.options),
  controller.bookAppointment
);
router.get(
  "/list_appoinment_patient",
  authenticate,
  controller.listAppointmentsForPatient
);
router.get(
  "/booked_appoinment",
  authenticate,
  controller.listAppointmentsForDoctor
);

module.exports = router;
