const schema = require("./schema");
const service = require("./service");
const bcrypt = require("bcrypt");
const jwt = require("../../system/middleware/jwt");

const registerUser = async (req, res) => {
  const {
    name,
    email,
    password,
    role_id,
    country_id,
    specialty_id,
    time_zone,
  } = req.body;

  const existingUser = await service.findUser(email);
  if (existingUser) {
    return res.status(400).json({ error: "Email Is Dublicate" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = {
    name,
    email,
    password: hashedPassword,
    role_id,
    country_id,
    specialty_id,
    time_zone,
  };
  try {
    const doctor = await service.create(user);
    const result = {
      message: "User Details",
      detail: doctor,
    };
    return res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  registerUser,
};
