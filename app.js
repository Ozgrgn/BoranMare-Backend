const config = require("./config.json");
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const booleanParser = require("express-query-boolean");
const app = express();
const http = require("http").createServer(app);

mongoose.connect(config.mongoUrl).catch((err) => {
  console.error(err);
});

const jwtParser = require("./modules/auth/middlewares/jwt-parser");
app.use(jwtParser);

app.use(booleanParser());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set("trust proxy", true);

app.all("/*", function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  res.header(
    "Access-Control-Allow-Methods",
    "PUT, POST, PATCH, GET, DELETE, OPTIONS"
  );
  next();
});

//routes
const userRouter = require("./modules/user/routes");
const countryRouter = require("./modules/country/routes");
const dealRouter = require("./modules/deal/routes");
const roomRouter = require("./modules/room/routes");
const reservationRouter = require("./modules/reservation/routes");
const authRouter = require("./modules/auth/routes");
const messageRouter = require("./modules/message/routes");

//////////////
//////////////
//////////////
//////////////

app.use("/user", userRouter);
app.use("/country", countryRouter);
app.use("/deal", dealRouter);
app.use("/room", roomRouter);
app.use("/reservation", reservationRouter);
app.use("/auth", authRouter);
app.use("/message", messageRouter);

app.get("/", (req, res) => {
  res.json({});
});

http.listen(process.env.PORT || 5000, (error) => {
  if (error) {
    throw error;
  }
  console.log(`listening on ${process.env.PORT || 5000}`);
});
