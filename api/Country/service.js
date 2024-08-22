const { CountrySchema } = require("./index");
// const { DoctorRegistrationSchema } = require("../Doctor/index");
// const { PatientRegistrationSchema } = require("../Patient/index");

const getAllCountry = async () => {
  const result = await CountrySchema.find();
  return result;
};

// const getAllDoctors = async () => {
//   return await DoctorRegistrationSchema.find();
// };

// const getAllPatients = async () => {
//   return await PatientRegistrationSchema.find();
// };

const updateCountryById = async (_id, updateData) => {
  return await CountrySchema.findByIdAndUpdate(_id, updateData, { new: true });
};

// const updateDoctorById = async (id, updateData) => {
//   return await DoctorRegistrationSchema.findByIdAndUpdate(id, updateData, {
//     new: true,
//   });
// };

// const updatePatientById = async (id, updateData) => {
//   return await PatientRegistrationSchema.findByIdAndUpdate(id, updateData, {
//     new: true,
//   });
// };

module.exports = {
  getAllCountry,
  updateCountryById,
  // getAllDoctors,
  // getAllPatients,
  // updateDoctorById,
  // updatePatientById,
};
