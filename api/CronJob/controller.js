// const { CronJob } = require("cron");

// // Define your cron jobs
// const jobs = [
//   {
//     schedule: "* * * * * *",
//     task: function () {
//       console.log("Function 1: You will see this message every second");
//     },
//   },
//   {
//     schedule: "0 * * * * *",
//     task: function () {
//       console.log("Function 2: You will see this message every minute");
//     },
//   },
//   {
//     schedule: "0 0 12 * * *",
//     task: function () {
//       console.log(
//         "Function 3: You will see this message every day at 12:00 PM"
//       );
//     },
//   },
// ];

// jobs.forEach((jobConfig) => {
//   const job = new CronJob(jobConfig.schedule, jobConfig.task);
//   job.start();
// });
