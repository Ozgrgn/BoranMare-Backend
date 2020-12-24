const express = require("express");
const router = express.Router();
const RoomController = require("../controllers");

const { body } = require("express-validator");
const { validator } = require("../../middlewares");

router.post(
  "/",
  body(["title"]).exists().isString(),
  validator,
  RoomController.addRoom
);
router.get("/", RoomController.getRooms);

module.exports = router;
