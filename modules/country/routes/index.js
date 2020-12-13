const express = require("express");
const router = express.Router();
const CountryController = require("../controllers");

const { body } = require("express-validator");
const { validator } = require("../../middlewares");

router.post(
  "/",
  body(["title", "key"]).exists().isString(),
  body(["price"]).exists().toInt().isInt(),
  validator,
  CountryController.addCountry
);
router.get("/", CountryController.getCountries);

module.exports = router;
