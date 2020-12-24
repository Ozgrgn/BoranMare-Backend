const { Room } = require("../model/index");
const addRoom = async (roomDetails) => {
  return new Room(roomDetails).save();
};
const getRooms = async () => {
  return Room.find();
};
const getRoomWithById = async (roomId) => {
  return Room.findById(roomId).exec();
};

module.exports = {
  addRoom,
  getRooms,
  getRoomWithById,
};
