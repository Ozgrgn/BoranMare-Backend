const express = require("express");
const router = express.Router();
const ReservationController = require("../controllers");

const { body, query } = require("express-validator");
const { validator } = require("../../middlewares");
const routeGuard = require("../../auth/middlewares/guard");
const AuthModel = require("../../auth/model/index");

router.post(
  "/",
  body(["voucherId", "room", "operator"]).exists().isString(),
  body(["names", "notes"]).optional().isString(),
  body(["adultPax", "child1Pax", "child2Pax"]).optional().toInt().isInt(),
  body(["adultPax"]).exists().toInt().isInt(),
  body(["checkIn", "checkOut", "reservationDate"]).exists().isISO8601(),
  body(["agency"]).exists().isMongoId(),
  body(["additionalServices"]).optional().isArray(),
  validator,
  ReservationController.addReservation
);
router.get(
  "/",
  routeGuard({
    allowedTypes: [AuthModel.TYPE_ADMIN],
  }),

  query([
    "resId",
    "agency",
    "reservationStatus",
    "operator",
    "voucherId",
    "room",
    "sort",
  ])
    .optional()
    .isString(),
  query("approvedStatus").optional().isBoolean(),
  query(["checkIn", "checkOut", "reservationDate"]).optional().isISO8601(),
  query(["limit", "skip"]).optional().toInt().isInt(),
  validator,
  ReservationController.getReservations
);

router.get(
  "/balance/:userId",
  ReservationController.getUserBalanceWithByuserId
);

module.exports = router;
