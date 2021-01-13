const express = require("express");
const router = express.Router();
const ReservationController = require("../controllers");

const { body, query, param } = require("express-validator");
const { validator } = require("../../middlewares");
const routeGuard = require("../../auth/middlewares/guard");
const AuthModel = require("../../auth/model/index");

router.post(
  "/",
  routeGuard({
    allowedTypes: [
      AuthModel.TYPE_ADMIN,
      AuthModel.TYPE_AGENCY,
      AuthModel.TYPE_REGION_MANAGER,
    ],
  }),
  body(["voucherId", "room","operator"]).exists().isString(),
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
    allowedTypes: [
      AuthModel.TYPE_ADMIN,
      AuthModel.TYPE_AGENCY,
      AuthModel.TYPE_REGION_MANAGER,
    ],
  }),

  query([
    "resId",
    "country",
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
  "/all",
  routeGuard({
    allowedTypes: [
      AuthModel.TYPE_ADMIN,
      AuthModel.TYPE_AGENCY,
      AuthModel.TYPE_REGION_MANAGER,
    ],
  }),
  validator,
  ReservationController.getAllReservations
);

router.get(
  "/:reservationId",
  routeGuard({
    allowedTypes: [
      AuthModel.TYPE_ADMIN,
      AuthModel.TYPE_AGENCY,
      AuthModel.TYPE_REGION_MANAGER,
    ],
  }),
  ReservationController.getReservationWithById
);

router.get(
  "/balance/:userId",
  routeGuard({
    allowedTypes: [
      AuthModel.TYPE_ADMIN,
      AuthModel.TYPE_AGENCY,
      AuthModel.TYPE_REGION_MANAGER,
    ],
  }),
  ReservationController.getUserBalanceWithByuserId
);

router.put(
  "/:reservationId",
  routeGuard({
    allowedTypes: [
      AuthModel.TYPE_ADMIN,
      AuthModel.TYPE_AGENCY,
      AuthModel.TYPE_REGION_MANAGER,
    ],
  }),
  param("reservationId").exists().isMongoId(),
  body(["reservation"]).exists(),
    body(["additionalServices"]).optional().isArray(),
  validator,
  ReservationController.updateReservationById
);

router.get(
  "/:reservationId/disable",
  routeGuard({
    allowedTypes: [AuthModel.TYPE_ADMIN,
    AuthModel.TYPE_REGION_MANAGER,],
  }),
  ReservationController.disableReservationWithById
);
router.get(
  "/:reservationId/enable",
  routeGuard({
    allowedTypes: [AuthModel.TYPE_ADMIN,
      AuthModel.TYPE_REGION_MANAGER,],
  }),
  ReservationController.enableReservationWithById
);
router.post(
  "/:reservationId/change-res-status",
  routeGuard({
    allowedTypes: [
      AuthModel.TYPE_ADMIN,
      AuthModel.TYPE_AGENCY,
      AuthModel.TYPE_REGION_MANAGER,
    ],
  }),
  param("reservationId").exists().isMongoId(),
  body(["reservationStatus"]).exists(),
  validator,
  ReservationController.changeResStatusWithById
 
);

module.exports = router;
