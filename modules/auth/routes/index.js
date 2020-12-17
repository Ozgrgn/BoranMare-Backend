const express = require("express");
const router = express.Router();
const AuthController = require("../controllers");

const { body } = require("express-validator");
const { validator } = require("../../middlewares");

router.post(
  "/signup",
  body("email").exists().isEmail(),
  body(["username", "password", "fullName", "userType"]).exists().isString(),
  body("country").exists().isMongoId(),
  validator,
  AuthController.signup
);

router.post(
  "/signup-verify",
  body(["userId", "code"]).exists().isString(),
  validator,
  AuthController.signupVerify
);

router.post(
  "/login",
  body(["username", "password"]).exists().isString(),
  validator,
  AuthController.login
);

module.exports = router;
