const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const middlewareConfig = require("./system/middleware/config");
const auth = require("./system/middleware/authentication");

if (process.env.NODE_ENV === "local") {
  require("dotenv").config({
    path: `./${process.env.NODE_ENV}.env`,
  });
}
app.use(express.json());
app.use(cors(middlewareConfig.cors));
app.use(helmet());
app.use(morgan(middlewareConfig.morganRequestFormat));
app.use(express.urlencoded({ extended: true }));

const appoinmentInfo = require("./api/Appoinment/route");
const doctorInfo = require("./api/Doctor/route");
const patientInfo = require("./api/Patient/route");
const signin = require("./api/Signin/route");
const country = require("./api/Country/route");
const cron = require("./api/CronJob/controller");

//public route
app.get("/", () => {
  res.send("hello world");
});
app.use("/doctor", doctorInfo);
app.use("/patient", patientInfo);
app.use("/", signin);

//private route
app.use(auth.authenticate);

app.use("/user", appoinmentInfo);
app.use("/country", country);

app.listen(3000, () => {
  console.log("Server Is Running On " + 3000);
});
