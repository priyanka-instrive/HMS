const { DoctorRegistrationSchema } = require("./index");

const create = async (params) => {
  let newData;

  try {
    newData = await DoctorRegistrationSchema.create(params);
  } catch (error) {
    console.error("Error in service create method:", error);
    throw error;
  }

  return newData;
};

const findUser = async (email) => {
  const data = await DoctorRegistrationSchema.findOne({ email: email });
  return data;
};

module.exports = {
  create,
  findUser,
};
