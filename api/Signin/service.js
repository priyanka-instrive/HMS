const { DoctorRegistrationSchema } = require("../Doctor/index");
const { PatientRegistrationSchema } = require("../Patient/index");

const findUser = async (email) => {
  let data = await DoctorRegistrationSchema.findOne({ email: email });
  if (!data) {
    data = await PatientRegistrationSchema.findOne({ email: email });
  }

  return data;
};

module.exports = {
  findUser,
};
