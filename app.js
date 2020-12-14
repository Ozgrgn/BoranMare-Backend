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
const authRouter = require("./modules/auth/routes");

//////////////
//////////////
//////////////
//////////////

app.use("/user", userRouter);
app.use("/country", countryRouter);
app.use("/auth", authRouter);

app.get("/", (req, res) => {
  res.status(200).end("API is work");
});

http.listen(3000, (error) => {
  if (error) {
    throw error;
  }
  console.log("listening on *:3000");
});
