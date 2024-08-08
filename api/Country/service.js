const { CountrySchema } = require("./index");

const getAllCountry = async () => {
  const result = await CountrySchema.find();
  return result;
};

module.exports = {
  getAllCountry,
};
