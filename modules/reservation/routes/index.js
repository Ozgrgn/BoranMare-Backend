const express = require("express");
const router = express.Router();
const ReservationController = require("../controllers");

const { body } = require("express-validator");
const { validator } = require("../../middlewares");

router.post(
  "/",
  body(["voucherId", "roomType"]).exists().isString(),
  body(["checkIn", "checkOut"]).exists().isISO8601(),
  body(["agency"]).exists().isMongoId(),
  validator,
  ReservationController.addReservation
);
router.get("/", ReservationController.getReservations);

module.exports = router;
