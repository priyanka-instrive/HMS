const express = require("express");
const router = express.Router();

const controller = require("./controller.js");
const { authenticate } = require("../../system/middleware/authentication.js");

router.get("/list_of_country", authenticate, controller.getCountrys);

module.exports = router;
