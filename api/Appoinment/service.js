const Appointment = require("./index");

const isAppointmentSlotAvailable = async (doctorId, fromDate, endDate) => {
  const overlappingAppointments = await Appointment.find({
    doctorId: doctorId,
    $and: [
      {
        $or: [
          { fromDate: { $lt: endDate }, endDate: { $gt: fromDate } },
          { fromDate: { $lt: endDate }, fromDate: { $gte: fromDate } },
          { endDate: { $gt: fromDate }, endDate: { $lte: endDate } },
        ],
      },
      { endDate: { $gte: fromDate } },
    ],
  });

  return overlappingAppointments.length === 0;
};

const createAppointment = async (appointmentData) => {
  const appointment = new Appointment(appointmentData);
  await appointment.save();
  return appointment;
};

const getAppointmentsByPatientId = async (params) => {
  const patientId = params;

  try {
    const appointments = await Appointment.find({ patientId }).exec();
    return {
      success: true,
      appointments,
    };
  } catch (error) {
    return {
      success: false,
      message: "Error retrieving appointments.",
      error: error.message,
    };
  }
};

const getAppointmentsByDoctorId = async (params) => {
  const doctorId = params;
  try {
    const appointments = await Appointment.find({ doctorId }).exec();
    return {
      success: true,
      appointments,
    };
  } catch (error) {
    return {
      success: false,
      message: "Error retrieving appointments.",
      error: error.message,
    };
  }
};

module.exports = {
  isAppointmentSlotAvailable,
  createAppointment,
  getAppointmentsByPatientId,
  getAppointmentsByDoctorId,
};
