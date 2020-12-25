const express = require("express");
const router = express.Router();
const UserController = require("../controllers");
const AuthModel = require("../../auth/model/index");
const { body, param } = require("express-validator");
const { validator } = require("../../middlewares");
const routeGuard = require("../../auth/middlewares/guard");

router.get(
  "/",
  routeGuard({
    allowedTypes: [AuthModel.TYPE_ADMIN],
  }),
  validator,
  UserController.getUsers
);
router.get(
  "/:userId",
  routeGuard({
    allowedTypes: [AuthModel.TYPE_ADMIN],
  }),
  param("userId").exists().isMongoId(),
  validator,
  UserController.getUserWithById
);
router.put(
  "/:userId",
  routeGuard({
    allowedTypes: [
      AuthModel.TYPE_ADMIN,
      AuthModel.TYPE_AGENCY,
      AuthModel.TYPE_REGION_MANAGER,
    ],
  }),
  param("userId").exists().isMongoId(),
  body(["user"]).exists(),
  validator,
  UserController.updateUserWithById
);

module.exports = router;
