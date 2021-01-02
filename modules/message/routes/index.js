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
  "/:user",
  routeGuard({
    allowedTypes: [
      AuthModel.TYPE_ADMIN,
      AuthModel.TYPE_AGENCY,
      AuthModel.TYPE_REGION_MANAGER,
    ],
  }),
  param(["user"]).optional(),
  MessageController.getMessages
);

module.exports = router;
