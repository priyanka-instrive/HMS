const { Schema, default: mongoose } = require("mongoose");
const { dbConn } = require("../../system/db/mongo");

const patientRegistrationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role_id: { type: mongoose.Schema.Types.ObjectId, required: true },
    country_id: { type: mongoose.Schema.Types.ObjectId, required: true },
    time_zone: { type: String, required: true },
  },
  { timestamps: true }
);

const PatientRegistrationSchema = dbConn.model(
  "Patient",
  patientRegistrationSchema,
  "Patients"
);

module.exports = {
  PatientRegistrationSchema,
};
