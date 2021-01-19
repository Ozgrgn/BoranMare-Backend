const express = require("express");
const router = express.Router();
const MessageController = require("../controllers");

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
  body(["title", "message"]).exists().isString(),
  body(["country", "users"]).optional(),
  validator,
  MessageController.addMessage
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
  validator,
  MessageController.getAllMessages
);
router.get(
  "/:country",
  routeGuard({
    allowedTypes: [
      AuthModel.TYPE_ADMIN,
      AuthModel.TYPE_AGENCY,
      AuthModel.TYPE_REGION_MANAGER,
    ],
  }),
  param(["country"]).optional(),
  validator,
  MessageController.getCountryMessages
);

router.get(
  "/:userId",
  routeGuard({
    allowedTypes: [
      AuthModel.TYPE_ADMIN,
      AuthModel.TYPE_AGENCY,
      AuthModel.TYPE_REGION_MANAGER,
    ],
  }),
  param(["userId"]).optional(),
  MessageController.getMessages
);

router.get(
  "/seen/:messageId/:userId",
  routeGuard({
    allowedTypes: [
      AuthModel.TYPE_ADMIN,
      AuthModel.TYPE_AGENCY,
      AuthModel.TYPE_REGION_MANAGER,
    ],
  }),
  param(["messageId", "userId"]).exists(),
  MessageController.setSeenMessage
);

module.exports = router;
