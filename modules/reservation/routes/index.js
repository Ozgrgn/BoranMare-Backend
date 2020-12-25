const express = require("express");
const router = express.Router();
const ReservationController = require("../controllers");

const { body } = require("express-validator");
const { validator } = require("../../middlewares");

router.post(
  "/",
  body(["voucherId", "room", "operator", "names", "notes"]).exists().isString(),
  body(["adultPax", "child1Pax", "child2Pax"]).exists().isNumeric(),
  body(["checkIn", "checkOut", "reservationDate"]).exists().isISO8601(),
  body(["agency"]).exists().isMongoId(),
  body(["additionalServices"]).optional().isArray(),
  validator,
  ReservationController.addReservation
);
router.get("/", ReservationController.getReservations);

router.get("/balance/:userId", ReservationController.getUserBalanceWithByuserId);

module.exports = router;
