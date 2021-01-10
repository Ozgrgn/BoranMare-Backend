const express = require("express");
const router = express.Router();
const OperatorController = require("../controllers");

const { body } = require("express-validator");
const { validator } = require("../../middlewares");

router.post(
  "/",
  body(["name"]).exists().isString(),
  validator,
  OperatorController.addOperator
);
router.get("/", OperatorController.getOperators);

module.exports = router;
