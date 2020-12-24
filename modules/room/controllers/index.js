const RoomService = require("../services/index");
const promiseHandler = require("../../utilities/promiseHandler");
const addRoom = async (req, res) => {
  const [room_err, room] = await promiseHandler(RoomService.addRoom(req.body));
  if (room_err) {
    return res.json({ status: false, message: room_err });
  }

  return res.json({ status: true, room });
};

const getRooms = async (req, res) => {
  const [rooms_err, rooms] = await promiseHandler(RoomService.getRooms());
  if (rooms_err) {
    return res.json({ status: false, message: rooms_err });
  }

  return res.json({ status: true, rooms });
};

module.exports = {
  addRoom,
  getRooms,
};
