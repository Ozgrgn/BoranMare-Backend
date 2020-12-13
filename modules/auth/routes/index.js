const express = require("express");
const router = express.Router();
const AuthController = require("../controllers");

const { body } = require("express-validator");
const { validator } = require("../../middlewares");

router.post(
  "/signup-email",
  body("email").exists().isEmail(),
  body(["username", "password", "fullName","userType"]).exists().isString(),
  body("country").exists().isMongoId(),
  validator,
  AuthController.signup
);

module.exports = router;
