const { Schema, default: mongoose } = require("mongoose");
const { dbConn } = require("../../system/db/mongo");

const doctorRegistrationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role_id: { type: String, required: true },
    specialty_id: { type: String, required: true },
    country_id: { type: String, required: true },
    time_zone: { type: String, required: true },
  },
  { timestamps: true }
);

const DoctorRegistrationSchema = dbConn.model(
  "Doctor",
  doctorRegistrationSchema,
  "Doctors"
);

module.exports = {
  DoctorRegistrationSchema,
};
