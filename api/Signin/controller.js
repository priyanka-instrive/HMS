const schema = require("./schema");
const service = require("./service");
const bcrypt = require("bcrypt");
const jwt = require("../../system/middleware/jwt");

const signin = async (req, res) => {
  const { email, password } = req.body;
  console.log("req.body==>>", req.body);
  const user = await service.findUser(email);
  if (!user) {
    return res.status(400).json("Invalid Credintial.");
  }
  const match = await bcrypt.compare(password, user.password);
  console.log(password, user.password, match);
  if (match) {
    const token = await jwt.createToken(user._id);
    const refreshToken = await jwt.createRefreshToken(user._id);
    const result = {
      message: "Sign In Successfully",
      accessToken: token,
      refreshToken,
      _id: user._id,
    };
    return res.status(200).json(result);
  } else {
    return res.status(400).json("Invalid Credintial.");
  }
};

module.exports = {
  signin,
};
