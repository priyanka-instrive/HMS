const express = require("express");
const router = express.Router();
const { celebrate } = require("celebrate");
const schema = require("./schema.js");

const controller = require("./controller.js");

router.post(
  "/sign_in",
  celebrate(schema.signin, schema.options),
  controller.signin
);

module.exports = router;
