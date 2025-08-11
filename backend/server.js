const express = require("express");
const compression = require("compression");
const cors = require("cors");
const path = require("path");
const http = require("http");
const env = require("./src/_config");
const connectDb = require("./src/database/db");
const endpoints = require("./src/routes");
// const webhookEndPoints = require('./src/WebhookRoutes')
const agencyAppEndPoints = require("./src/AgencyAppRoutes");
const morgan = require("morgan");
const initSocket = require("./socket");
// const cronJobs = require("./src/lib/crons");
const multer = require("multer");
const upload = multer();
const app = express();
// cron job
// cronJobs.start({ all: true });

// Connect to Database
connectDb();
app.use(morgan("dev"));
const server = http.createServer(app);
// initAgencyAppSocket(server, app);

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: "5000mb" }));
app.use(compression());
app.use(cors(env.corsOption));
app.use(express.static(path.join(__dirname, "build")));
app.set("view engine", "ejs");

app.options('*', cors())
// app.use(function (req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
//     res.header("Access-Control-Allow-Headers", "Origin,Content-Type,x-auth-user,x-amz-meta-fieldname,x-auth-token");
//     next();
// });

server.listen(env.port, () => {
  console.log(
    "Server is listening at",
    env.port,
    "with env",
    process.env.NODE_ENV
  );
});

endpoints(app);
initSocket(server, app);

// webhookEndPoints(app)
agencyAppEndPoints(app);
app.post("/webhook/servicem8", upload.none(), (req, res) => {
  // Extract form data from req.body
  //console.log(req.body, "req.body");
  //console.log(req.query, "req.query");

  // Send a response back to the client
  res.send(req.body.challenge);
});
process.on("unhandledRejection", (err) => {
  console.log(
    "Unhandeled Rejection\n ",
    err.response?.data || err.message || err
  );
});

process.on("uncaughtException", (err) => {
  console.log(
    "Uncaught Rejection\n ",
    err.response?.data || err.message || err
  );
});
