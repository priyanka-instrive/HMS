const mongoose = require("mongoose");
const { dbConn } = require("../../system/db/mongo");

const appointmentSchema = new mongoose.Schema(
  {
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    fromDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    reason: { type: String, required: true },
  },
  { timestamps: true }
);

const Appointment = dbConn.model(
  "Appointment",
  appointmentSchema,
  "Appointments"
);

module.exports = Appointment;
