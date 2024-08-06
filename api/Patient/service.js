const { PatientRegistrationSchema } = require("./index");

const create = async (params) => {
  let newData;

  try {
    newData = await PatientRegistrationSchema.create(params);
  } catch (error) {
    console.error("Error in service create method:", error);
    throw error;
  }

  return newData;
};

const findUser = async (email) => {
  const data = await PatientRegistrationSchema.findOne({ email: email });
  return data;
};

const getPatient = async (patient_id) => {
  const data = await PatientRegistrationSchema.findOne({ _id: patient_id });
  return data;
};

module.exports = {
  create,
  findUser,
  getPatient,
};
