const express = require("express");
const router = express.Router();
const DealController = require("../controllers");

const { body, param } = require("express-validator");
const { validator } = require("../../middlewares");

const routeGuard = require("../../auth/middlewares/guard");
const AuthModel = require("../../auth/model/index");
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

router.delete(
  "/:dealId",
  routeGuard({
    allowedTypes: [AuthModel.TYPE_ADMIN],
  }),
  param("dealId").exists().isMongoId(),
  validator,
  DealController.deleteOneDeal
);

router.put(
  "/:dealId",
  routeGuard({
    allowedTypes: [AuthModel.TYPE_ADMIN],
  }),
  param("dealId").exists().isMongoId(),
  body(["deal"]).exists(),
  validator,
  DealController.updateDealWithById
);
module.exports = router;
