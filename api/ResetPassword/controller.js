const boom = require("@hapi/boom");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
const Password = require("./index");
const service = require("./service");
const userService = require("../BasicInfo/service");
const sendMail = require("../../system/sendmail/index");

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  const user = await userService.findUser(email);
  if (!user) {
    const result = {
      message: "User Not Found",
    };
    return res.status(400).json(result);
  }

  const secretKey = uuidv4();
  const link = `http://localhost:3000/update_password/?token=${secretKey}`;
  const resetPass = new Password({
    _id: user?._id,
    secretKey,
  });

  const add = await service.create(resetPass);
  if (!add._id) {
    return res.status(400).json("Something Went Wrong");
  }
  await sendMail(email, link);

  const result = {
    data: link,
    message: "To Reset Password Link Sended Successfully",
  };
  return res.status(200).json(result);
};

const changePassword = async (req, res) => {
  const { email, currPassword, newPassword } = req.body;

  const user = await userService.findUser(email);
  if (!user) {
    const result = {
      message: "User Not Found",
    };
    return res.status(400).json(result);
  }
  const match = await bcrypt.compare(currPassword, user.password);
  if (!match) {
    res.status(400).json("Password Not Match");
  }
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await userService.update(user._id, { password: hashedPassword });

  const result = {
    message: " Password  Changed Successfully",
  };
  return res.status(400).json(result);
};

module.exports = {
  forgotPassword,
  changePassword,
};
