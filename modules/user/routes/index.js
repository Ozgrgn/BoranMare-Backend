const express = require("express");
const router = express.Router();
const UserController = require("../controllers");
const AuthModel = require("../../auth/model/index");
const { body, query, param } = require("express-validator");
const { validator } = require("../../middlewares");
const routeGuard = require("../../auth/middlewares/guard");

router.get(
  "/",
  routeGuard({
    allowedTypes: [ AuthModel.TYPE_ADMIN,
     
      AuthModel.TYPE_REGION_MANAGER,],
  }),
  query(["email", "fullName", "name", "phone", "country", "sort","userStatus"])
    .optional()
    .isString(),
  query(["balance", "limit", "skip"]).optional().toInt().isInt(),
  validator,
  UserController.getUsers
);
router.get(
  "/agencies",
  routeGuard({
    allowedTypes: [
      AuthModel.TYPE_ADMIN,
      AuthModel.TYPE_REGION_MANAGER,
    ],
  }),
  validator,
  UserController.getAgencies
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
router.post(
  "/:userId/change-user-status",
  routeGuard({
    allowedTypes: [
      AuthModel.TYPE_ADMIN,
      AuthModel.TYPE_REGION_MANAGER,
    ],
    
  }),
  param("userId").exists().isMongoId(),
  body(["userStatus"]).exists(),
  validator,
  UserController.changeUserStatusWithById
);
router.post(
  "/:userId/receipt",
  routeGuard({
    allowedTypes: [
      AuthModel.TYPE_ADMIN,
      AuthModel.TYPE_AGENCY,
      AuthModel.TYPE_REGION_MANAGER,
    ],
  }),
  param("userId").exists().isMongoId(),
  body(["description"]).exists(),
  body(["amount"]).exists().toInt().isInt(),
  body(["receiptDate"]).exists().isISO8601(),
  validator,
  UserController.addReceiptWithById
);
router.delete(
  "/:userId/receipt/:createDate",
  routeGuard({
    allowedTypes: [
      AuthModel.TYPE_ADMIN,
      AuthModel.TYPE_REGION_MANAGER,
    ],
  }),
  param("userId").exists().isMongoId(),
  param(["createDate"]).exists(),
  validator,
  UserController.deleteOneReceipt
);

module.exports = router;
