const { Schema, default: mongoose } = require("mongoose");
const { dbConn } = require("../../system/db/mongo");

const countrySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    code: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const CountrySchema = dbConn.model(
  "Internatinal",
  countrySchema,
  "Internatinals"
);

module.exports = {
  CountrySchema,
};
