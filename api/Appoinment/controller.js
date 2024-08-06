const service = require("./service");
const { DoctorRegistrationSchema } = require("../Doctor/index");
const moment = require("moment-timezone");

const bookAppointment = async (req, res) => {
  const { doctorId, patientId, fromDate, endDate, reason } = req.body;

  const doctorData = await DoctorRegistrationSchema.findOne({ _id: doctorId });

  if (!doctorData) {
    return res.status(404).json({
      success: false,
      message: "Doctor not found.",
    });
  }

  const doctorTimeZone = doctorData.time_zone;

  const fromDateInDoctorTimeZone = moment.tz(fromDate, doctorTimeZone).toDate();
  const endDateInDoctorTimeZone = moment.tz(endDate, doctorTimeZone).toDate();

  try {
    const slotAvailable = await service.isAppointmentSlotAvailable(
      doctorId,
      fromDateInDoctorTimeZone,
      endDateInDoctorTimeZone
    );

    if (!slotAvailable) {
      return res.status(400).json({
        success: false,
        message: "Appointment slot is already booked.",
      });
    }

    // Create a new appointment
    const appointmentData = {
      doctorId,
      patientId,
      fromDate: moment.tz(fromDateInDoctorTimeZone, doctorTimeZone).toDate(),
      endDate: moment.tz(endDateInDoctorTimeZone, doctorTimeZone).toDate(),
      reason,
    };

    const appointment = await service.createAppointment(appointmentData);

    return res.status(201).json({
      success: true,
      message: "Appointment booked successfully.",
      appointment,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error booking appointment.",
      error: error.message,
    });
  }
};

const listAppointmentsForPatient = async (req, res) => {
  console.log("00000000000");
  const patientId = req.user;

  if (!patientId) {
    return res
      .status(400)
      .json({ success: false, message: "Patient ID is required." });
  }
  if (!patientId) {
    return res
      .status(400)
      .json({ success: false, message: "Patient ID is required." });
  }

  try {
    const result = await service.getAppointmentsByPatientId(patientId);

    if (result.success) {
      return res.status(200).json(result);
    } else {
      return res.status(400).json(result);
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const listAppointmentsForDoctor = async (req, res) => {
  const doctorId = req.user;
  if (!doctorId) {
    return res
      .status(400)
      .json({ success: false, message: "Doctor ID is required." });
  }

  try {
    const result = await service.getAppointmentsByDoctorId(doctorId);

    if (result.success) {
      return res.status(200).json(result);
    } else {
      return res.status(400).json(result);
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

module.exports = {
  bookAppointment,
  listAppointmentsForPatient,
  listAppointmentsForDoctor,
};
