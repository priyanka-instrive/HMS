/* eslint-disable no-unused-vars */
const express = require("express");

const router = express.Router();
const controller = require("./controller.js");

router.post("/forgot_password", controller.forgotPassword);

router.post("/change_password", controller.changePassword);

module.exports = router;
