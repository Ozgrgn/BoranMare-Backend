const express = require("express");
const router = express.Router();
const DealController = require("../controllers");

const { body } = require("express-validator");
const { validator } = require("../../middlewares");

router.post(
  "/",
  body(["startDate", "endDate", "room", "country"]).exists().isString(),
  body([
    "bonusPrice",
    "servicePrice1",
    "servicePrice2",
    "servicePrice3",
    "servicePrice4",
  ])
    .exists()
    .toInt()
    .isInt(),
  validator,
  DealController.addDeal
);
router.get("/", DealController.getDeals);

module.exports = router;
